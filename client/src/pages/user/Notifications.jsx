import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserState";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Button from "../../components/ui/button";
import Alert from "../../components/ui/alert";

const Notifications = () => {
  const { getNotifications, markNotificationRead } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      const res = await getNotifications();
      if (!res?.success) {
        setError(res?.message || "Unable to load notifications.");
        return;
      }
      setNotifications(res.data || []);
    };

    loadNotifications();
  }, [getNotifications]);

  const markRead = async (id) => {
    const res = await markNotificationRead(id);
    if (!res?.success) {
      return;
    }

    setNotifications((prev) =>
      prev.map((item) => (item._id === id ? { ...item, read: true } : item))
    );
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-slate-50 via-white to-cyan-50 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-black tracking-tight">Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {error ? (
              <Alert variant="error" title="Failed">
                {error}
              </Alert>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-slate-500">No notifications yet.</p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  className={`border rounded-lg p-3 ${
                    item.read ? "bg-white" : "bg-cyan-50 border-cyan-200"
                  }`}
                >
                  <p className="text-sm text-slate-800">{item.message}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                    {!item.read ? (
                      <Button size="sm" variant="outline" onClick={() => markRead(item._id)}>
                        Mark as read
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
