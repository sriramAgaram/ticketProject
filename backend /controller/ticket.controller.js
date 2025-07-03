import pool from "../database/db.js";

export const createTicketController = async (req, res) => {
  const { title, category, contactInfo, description } = req.body;
  const query = `INSERT INTO tickets (authorId , title , description , category ,contactInfo , image ) VALUES (? , ? , ? , ? , ? , ?)`;

  const image = req.file.filename;
  const authorId = req.user.id;
  try {
    const [result] = await pool
      .promise()
      .query(query, [
        authorId,
        title,
        description,
        category,
        contactInfo,
        image,
      ]);

    return res
      .status(201)
      .json({ success: true, message: "Ticket created Successfully", result });
  } catch (error) {
    console.error(`error from raiseTicket Controller ${error}`);
    return res.status(500).json({
      success: false,
      message: `Error from Raise Ticket Controller ${error}`,
    });
  }
};
export const getTicketsController = async (req, res) => {
  const authorId = req.user.id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let query = "";
  let values = [];
  let countQuery = "";
  let pendingQuery ='';
  let allTickets ='';
  let countAllStatus = '';
  let countAllPriorityForDashboard ='';
  let countForTodayUpdated =''

  if (req.user.role === "admin") {
    query = `
      SELECT 
        tickets.*, 
        author.name AS authorName, 
        assigned.name AS assignedName, 
        updated.name AS updatedByName
      FROM tickets
      JOIN auth AS author ON tickets.authorId = author.id
      LEFT JOIN auth AS assigned ON tickets.assignedTo = assigned.id
      LEFT JOIN auth AS updated ON tickets.updatedBy = updated.id
      ORDER BY tickets.createdAt DESC
      LIMIT ? OFFSET ?
    `;
    values = [limit, offset];
    countQuery = `SELECT COUNT(*) AS total FROM tickets`;
    pendingQuery =`SELECT COUNT(*) AS total FROM tickets where status = ?`;
    allTickets = `SELECT * FROM tickets`
    countAllStatus = `SELECT status,count(status) as statusCount FROM tickets GROUP BY status`
     countAllPriorityForDashboard=`SELECT priority,count(priority) as priorityCount FROM tickets GROUP BY priority`  
     countForTodayUpdated =`SELECT count(*) AS total FROM tickets WHERE date(updatedAt) = curdate()`

  } else {
    query = `
      SELECT * FROM tickets 
      WHERE authorId = ? 
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `;
    values = [authorId, limit, offset];
  }

  try {
    const [result] = await pool.promise().query(query, values);

    if (req.user.role === "admin") {
      const [countResult] = await pool.promise().query(countQuery);
      const [countPending] = await pool.promise().query(pendingQuery , ['Pending']);
      const [allTicketsforDashBoard] = await pool.promise().query(allTickets);
      const [countAllSts] = await pool.promise().query(countAllStatus)
      const [countAllPriority] = await pool.promise().query(countAllPriorityForDashboard);
      const [totalTodayUpdated] = await pool.promise().query(countForTodayUpdated)
      const totalCount = countResult[0]?.total || 0;
      const totalPending = countPending[0]?.total||0;
      const totalUpdated = totalTodayUpdated[0]?.total||0;
    


      return res.status(200).json({
        success: true,
        message: "Tickets Fetched Successfully",
        result,
        page,
        limit,
        totalCount,
        totalPending,
        allTicketsforDashBoard,
        countAllSts,
        countAllPriority,
        totalUpdated
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tickets Fetched Successfully",
      result,
      page,
      limit,
      
    });
  } catch (error) {
    console.error(`error from getTickets Controller ${error}`);
    return res.status(500).json({
      success: false,
      message: `Error from getTickets Ticket Controller ${error.message}`,
    });
  }
};

export const updateTicketController = async (req, res) => {
  const id = req.params.id;
  const { status, assignedTo, priority } = req.body;
  const userId = req.user.id;

  if (!status && !assignedTo && !priority) {
    return res.status(400).json({
      success: false,
      message:
        "At least one field (status, assignedTo or priority) must be provided",
    });
  }

  try {
    const [[oldTicket]] = await pool
      .promise()
      .query(`SELECT status, assignedTo FROM tickets WHERE id = ?`, [id]);

    if (!oldTicket) {
      return res.status(404).json({
        success: false,
        message: `Ticket with ID ${id} not found`,
      });
    }

    const oldStatus = oldTicket.status;
    const oldAssignedTo = oldTicket.assignedTo;

    const updateQuery = `
      UPDATE tickets
      SET status = ?, assignedTo = ?, updatedBy = ?, priority = ?
      WHERE id = ?
    `;
    const [updateResult] = await pool
      .promise()
      .query(updateQuery, [status, assignedTo, userId, priority, id]);

    let actionParts = [];

    if (oldStatus !== status) {
      actionParts.push(`Status changed from ${oldStatus} to ${status}`);
    }

    let oldAssigned;
    let newAssigned;

    if (oldAssignedTo !== assignedTo) {
      actionParts.push(
        `Reassigned from user ID ${oldAssignedTo} to ${assignedTo}`
      );
      oldAssigned = oldAssignedTo;
      newAssigned = assignedTo;
    } else {
      oldAssigned = null;
      newAssigned = null;
    }

    if (actionParts.length > 0) {
      const action = actionParts.join(" | ");

      const insertHistoryQuery = `
        INSERT INTO ticketsHistory (ticketId, action, updatedBy, oldAssignedTo, newAssignedTo)
        VALUES (?, ?, ?, ?, ?)
      `;

      const [historyResult] = await pool
        .promise()
        .query(insertHistoryQuery, [
          id,
          action,
          userId,
          oldAssigned,
          newAssigned,
        ]);

      return res.status(201).json({
        success: true,
        message: "Ticket updated and history logged",
        result: updateResult,
        history: historyResult,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Ticket updated (no changes in status or assignment)",
        result: updateResult,
      });
    }
  } catch (error) {
    console.error(`Error in updateTicketController:`, error);
    return res.status(500).json({
      success: false,
      message: `Server error`,
      error: error.message,
    });
  }
};

export const getTicketsHistory = async (req, res) => {
  const id = req.params.id;

  const query = `SELECT 
  ticketsHistory.*, 
  updater.name AS updatedByName,
  oldAssignee.name AS oldAssignedName,
  newAssignee.name AS newAssignedName
FROM ticketsHistory
LEFT JOIN auth AS updater ON ticketsHistory.updatedBy = updater.id
LEFT JOIN auth AS oldAssignee ON ticketsHistory.oldAssignedTo = oldAssignee.id
LEFT JOIN auth AS newAssignee ON ticketsHistory.newAssignedTo = newAssignee.id
WHERE ticketId = ?
ORDER BY changedAt DESC;
`;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: `Ticket ID is required` });
    }

    const [result] = await pool.promise().query(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No history found for Ticket ID ${id}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Ticket Id ${id} History fetched SuccessFully`,
      result,
    });
  } catch (error) {
    console.log(`Error From getTickets Controller ${error}`);
    return res.status(500).json({
      success: false,
      message: `Error From getTickets Controller ${error}`,
    });
  }
};

export const getSingleTicket = async (req, res) => {
  const id = req.params.id;

  const query = `select tickets.* , 
  author.name as authorName ,
  assigned.name as assignedName,
  updated.name as updatedName from tickets join auth as author on tickets.authorId = author.id left join 
  auth as assigned on tickets.assignedTo =  assigned.id left join 
  auth as updated on tickets.updatedBy = updated.id  where tickets.id = ?`;
  try {
    const [result] = await pool.promise().query(query, [id]);
    return res.status(201).json({
      success: true,
      message: "Signle Ticket fetched Successfully",
      result,
    });
  } catch (error) {
    console.error(`error from getSingleTicket Controller ${error}`);
    return res.status(500).json({
      success: false,
      message: `Error from getSingleTicket Ticket Controller ${error}`,
    });
  }
};

// export const searchCotroller = async (req, res) => {
//   const status = req.body;

//   const placeholders = status.map(() => "?").join(",");
//   const query = `SELECT * FROM tickets WHERE status IN (${placeholders}) AND authorId = ?`;

//   try {
//     const userId = req.user?.id;
//     const [result] = await pool.promise().query(query, [...status, userId]);
//     console.log(result);

//     return res.status(200).json({
//       success: true,
//       message: "Search results fetched Successfully",
//       result,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: true,
//       message: `Error from Search Controller ${error}`,
//     });
//   }
// };

export const assignedTicketsController = async (req, res) => {
  const userId = req.user?.id;

  const query = `SELECT * FROM tickets WHERE assignedTo = ?`;

  try {
    const [result] = await pool.promise().query(query, [userId]);

    return res.status(200).json({
      success: true,
      message: "Assigned tickets fetched successfully",
      result,
    });
  } catch (error) {
    console.error("Error from assignedTicketsController:", error);
    return res.status(500).json({
      success: false,
      message: `Error from assignedTicketsController: ${error.message}`,
    });
  }
};
