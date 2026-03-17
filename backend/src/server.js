import app from "./app.js";
import connectDB from "./config/db.js";
import User from "./modules/users/user.model.js";
import Course from "./modules/courses/course.model.js";
import Batch from "./modules/batches/batch.model.js";
import Enrollment from "./modules/enrollments/enrollment.model.js";
import Invoice from "./modules/finance/invoice.model.js";
import Payment from "./modules/finance/payment.model.js";
import Notification from "./modules/notifications/notification.model.js";
import Lead from "./modules/leads/lead.model.js";
import Support from "./modules/support/support.model.js";
import DemoCourse from "./modules/demo-courses/demo-course.model.js";
import Session from "./modules/sessions/session.model.js";

const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));