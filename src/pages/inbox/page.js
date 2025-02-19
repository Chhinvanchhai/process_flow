const InboxPage = () => {
  const [workflowInstance, setWorkflowInstance] = useState(null);

  const fetchWorkflowInstance = async (instanceId) => {
    const response = await fetch(`/api/workflow-instances/${instanceId}`);
    if (response.ok) {
      const data = await response.json();
      setWorkflowInstance(data);
    }
  };

  const handleApprove = async () => {
    const response = await fetch(
      `/api/workflow-instances/${workflowInstance.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved", performedBy: "user_id" }),
      }
    );

    if (response.ok) {
      alert("Workflow instance approved!");
      fetchWorkflowInstance(workflowInstance.id); // Refresh the instance data
    } else {
      alert("Failed to approve workflow instance");
    }
  };

  const handleReject = async () => {
    const response = await fetch(
      `/api/workflow-instances/${workflowInstance.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", performedBy: "user_id" }),
      }
    );

    if (response.ok) {
      alert("Workflow instance rejected!");
      fetchWorkflowInstance(workflowInstance.id); // Refresh the instance data
    } else {
      alert("Failed to reject workflow instance");
    }
  };

  const nodes = [
    {
      id: "1",
      type: "custom",
      data: { label: "Approval by CEO", status: workflowInstance?.status },
      position: { x: 50, y: 50 },
      style: {
        backgroundColor:
          workflowInstance?.status === "approved" ? "green" : "gray",
      },
    },
    {
      id: "2",
      type: "custom",
      data: {
        label: "Informed when approved",
        status: workflowInstance?.status,
      },
      position: { x: 400, y: 50 },
      style: {
        backgroundColor:
          workflowInstance?.status === "approved" ? "green" : "gray",
      },
    },
  ];

  useEffect(() => {
    fetchWorkflowInstance(instanceId);
  }, [instanceId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Inbox</h1>

      {/* Inbox */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Inbox</h2>
        <div className="border rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="font-bold">From: John Doe</div>
            <div className="text-sm">2 days ago</div>
          </div>
          <div className="font-bold">Subject: Meeting Reminder</div>
          <div className="mt-2">
            Hi Team, this is a reminder for the meeting scheduled tomorrow at
            10:00 AM.
          </div>
        </div>
      </div>
    </div>
  );
};
export default InboxPage;
