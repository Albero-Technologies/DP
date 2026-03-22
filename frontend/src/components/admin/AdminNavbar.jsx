import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import API from "../../api/axiosInstance";
import { getStudentNotifications, markAllNotificationsRead, markNotificationRead } from "../../api/students.api";
import CashfreeCheckout from "../CashfreeCheckout";

function getInitials(name = "") {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??";
}

const roleNames = {
  admin:"Admin", ADMIN:"Admin",
  trainer:"Trainer", TRAINER:"Trainer",
  counselor:"Counselor", COUNSELOR:"Counselor",
  student:"Student", STUDENT:"Student",
};

export default function AdminNavbar({ role = "admin" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifs,     setShowNotifs]     = useState(false);
  const [notifications,  setNotifications]  = useState([]);
  const [payInvoice,     setPayInvoice]     = useState(null);
  const [loadingInvoice, setLoadingInvoice] = useState(null);
  const dropdownRef = useRef(null);
  const isStudent = (user?.role || role).toUpperCase() === "STUDENT";

  useEffect(() => {
    if (!isStudent) return;
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [isStudent]);

  const loadNotifications = () => {
    if (!isStudent) return;
    getStudentNotifications()
      .then(res => setNotifications(res.data || []))
      .catch(() => {});
  };

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter(n => !n.isRead);

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    loadNotifications();
  };

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) {
      await markNotificationRead(notif._id).catch(() => {});
      loadNotifications();
    }
    if (!isPaymentReminder(notif)) setShowNotifs(false);
  };

  const isPaymentReminder = (n) =>
    n.type === "REMINDER" ||
    n.title?.toLowerCase().includes("reminder") ||
    n.title?.toLowerCase().includes("payment reminder");

  // Pay Now — extract amount from notification, find/create invoice
  const handlePayNow = async (e, notif) => {
    e.stopPropagation();
    setShowNotifs(false);
    setLoadingInvoice(notif._id);
    try {
      // Step 1: Get existing invoices
      const res = await API.get("/student/payments");
      const invoices = res.data.data?.invoices || [];
      let dueInvoice = invoices.find(inv => (inv.totalAmount - inv.amountPaid) > 0);

      // Step 2: No invoice — auto-create (DEMO or BATCH)
      if (!dueInvoice) {
        try {
          // Detect if reminder is for DEMO or BATCH
          const isDemoReminder = notif.message?.toLowerCase().includes("demo") ||
            notif.title?.toLowerCase().includes("demo");
          const amountMatch = notif.message?.match(/[₹Rs.]+\s*([\d,]+)/);
          const reminderAmount = amountMatch ? Number(amountMatch[1].replace(/,/g,"")) : null;

          const autoRes = await API.post("/student/auto-invoice", {
            courseType: isDemoReminder ? "DEMO" : "BATCH",
            amount: reminderAmount,
          });
          dueInvoice = autoRes.data.data?.dueInvoice;
        } catch {}
      }

      if (dueInvoice) {
        setPayInvoice(dueInvoice);
      } else {
        navigate("/student/payments");
      }
    } catch {
      navigate("/student/payments");
    } finally {
      setLoadingInvoice(null);
    }
  };

  const handleLogout = () => { logout(); navigate("/signin"); };

  const notifIcon = (type) => {
    if (type === "PAYMENT" || type === "REMINDER") return "💳";
    if (type === "INVOICE")    return "📄";
    if (type === "ENROLLMENT") return "✅";
    if (type === "BATCH")      return "📦";
    if (type === "SESSION")    return "🗓";
    return "🔔";
  };

  return (
    <>
      {payInvoice && (
        <CashfreeCheckout
          invoice={payInvoice}
          onClose={() => setPayInvoice(null)}
          onSuccess={() => {
            setPayInvoice(null);
            loadNotifications();
            navigate("/student/payments");
          }}
        />
      )}

      <header className="admin-navbar">
        <div className="admin-navbar-inner">
          <div className="admin-navbar-spacer" />

          <label className="admin-search" htmlFor="admin-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>
            </svg>
            <input id="admin-search" type="text" placeholder="Search..." />
          </label>

          <div className="admin-navbar-actions">
            <div style={{ position:"relative" }} ref={dropdownRef}>
              <button className="admin-icon-btn" type="button" aria-label="Notifications"
                onClick={() => setShowNotifs(p => !p)} style={{ position:"relative" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>
                </svg>
                {unread.length > 0 && (
                  <span style={{ position:"absolute",top:-4,right:-4,background:"#ef4444",color:"#fff",borderRadius:"50%",width:18,height:18,fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #fff" }}>
                    {unread.length > 9 ? "9+" : unread.length}
                  </span>
                )}
              </button>

              {showNotifs && isStudent && (
                <div style={{ position:"absolute",right:0,top:"calc(100% + 8px)",width:360,background:"#fff",borderRadius:14,boxShadow:"0 8px 32px rgba(0,0,0,0.15)",border:"1px solid #e5e7eb",zIndex:200,overflow:"hidden" }}>
                  <div style={{ padding:"14px 16px",borderBottom:"1px solid #f3f4f6",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                    <strong style={{ fontSize:14 }}>
                      Notifications
                      {unread.length > 0 && <span style={{ background:"#ef4444",color:"#fff",borderRadius:99,padding:"1px 7px",fontSize:11,marginLeft:6 }}>{unread.length}</span>}
                    </strong>
                    {unread.length > 0 && (
                      <button onClick={handleMarkAllRead} style={{ fontSize:11,color:"#6366f1",background:"none",border:"none",cursor:"pointer",fontWeight:600 }}>
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight:420,overflowY:"auto" }}>
                    {notifications.length === 0 && (
                      <div style={{ padding:"28px 16px",textAlign:"center",color:"#9ca3af",fontSize:13 }}>
                        <div style={{ fontSize:32,marginBottom:8 }}>🔔</div>No notifications yet
                      </div>
                    )}
                    {notifications.map(n => {
                      const isReminder = isPaymentReminder(n);
                      return (
                        <div key={n._id} onClick={() => handleNotifClick(n)}
                          style={{ padding:"12px 16px",borderBottom:"1px solid #f9fafb",cursor:"pointer",background:n.isRead?"#fff":"#f0f4ff",transition:"background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background="#f9fafb"}
                          onMouseLeave={e => e.currentTarget.style.background=n.isRead?"#fff":"#f0f4ff"}>
                          <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                            <div style={{ fontSize:20,flexShrink:0,marginTop:1 }}>{notifIcon(n.type)}</div>
                            <div style={{ flex:1,minWidth:0 }}>
                              <div style={{ fontWeight:n.isRead?500:700,fontSize:13,color:"#111827" }}>{n.title}</div>
                              <div style={{ fontSize:12,color:"#6b7280",marginTop:2,lineHeight:1.4 }}>{n.message}</div>
                              <div style={{ fontSize:11,color:"#9ca3af",marginTop:4 }}>
                                {new Date(n.createdAt).toLocaleString("en-IN")}
                              </div>
                              {/* Pay Now — only for payment reminders */}
                              {isReminder && (
                                <button
                                  onClick={e => handlePayNow(e, n)}
                                  disabled={loadingInvoice === n._id}
                                  style={{ marginTop:8,padding:"6px 16px",background:loadingInvoice===n._id?"#a5b4fc":"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontSize:12,fontWeight:700,display:"inline-flex",alignItems:"center",gap:6,boxShadow:"0 2px 8px rgba(99,102,241,0.3)" }}>
                                  {loadingInvoice===n._id ? <><span>⏳</span> Loading…</> : <><span>💳</span> Pay Now</>}
                                </button>
                              )}
                            </div>
                            {!n.isRead && <div style={{ width:8,height:8,borderRadius:"50%",background:"#6366f1",flexShrink:0,marginTop:4 }} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="admin-user">
              <div>
                <div className="admin-user-name">{user?.name || "User"}</div>
                <div className="admin-user-role">{roleNames[user?.role || role] || "User"}</div>
              </div>
              <div className="admin-avatar" title="Click to logout" style={{ cursor:"pointer" }} onClick={handleLogout}>
                {getInitials(user?.name)}
                <span className="admin-status" />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}