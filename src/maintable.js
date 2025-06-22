import { useEffect, useState } from "react";
import "./App.css";
import { Button, Popover, Space, Switch, Table, Tag } from "antd";
import {
  AudioOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import ContentEditModal from "./editModel";
import { FloatButton } from "antd";
import { useParams } from "react-router-dom";

function MainTable() {
  const { type } = useParams();
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => id?.$oid || "N/A",
      width: 100,
      fixed: "left",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: 200,
    },
    {
      title: "Category",
      dataIndex: "catagory", // Note: Original spelling preserved
      key: "catagory",
      width: 100,
    },
    {
      title: "Text Content",
      dataIndex: "text",
      key: "text",
      ellipsis: true,
      render: (text) => (
        <Popover
          content={
            <div
              style={{
                maxWidth: "500px",
                textAlign: "center",
                overflowY: "auto",
              }}
            >
              {text}
            </div>
          }
          title="Content Details"
        >
          <div style={{ maxWidth: "800px", overflow: "hidden" }}> {text} </div>
        </Popover>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Space>
          <Tag color={record.taken ? "green" : "red"}>
            {record.taken ? "Taken" : "Available"}
          </Tag>
          <Tag color={record.ready ? "blue" : "orange"}>
            {record.ready ? "Ready" : "Processing"}
          </Tag>
        </Space>
      ),
      width: 180,
    },
    {
      title: "Disable",
      key: "disabled",
      render: (_, record) => (
        <Space>
          <Switch
            checked={record?.disabled || false}
            onClick={() => {
              updateRow({ ...record, disabled: !(record?.disabled || false) });
            }}
          />
        </Space>
      ),
      width: 100,
    },
    {
      title: "Media",
      key: "media",
      render: (_, record) => (
        <Space>
          {record.audio && <Tag icon={<AudioOutlined />}>Audio</Tag>}
          {record.video && <Tag icon={<VideoCameraAddOutlined />}>Video</Tag>}
        </Space>
      ),
      width: 150,
    },
    {
      title: "Subtitles",
      dataIndex: "subtitle",
      key: "subtitle",
      render: (subtitles) => (
        <Popover
          content={
            <div style={{ maxHeight: 200, overflowY: "auto" }}>
              {subtitles?.map((sub, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <p>
                    <strong>Text:</strong> {sub.text}
                  </p>
                  <p>
                    <small>
                      {sub.start}s - {sub.end}s
                    </small>
                  </p>
                </div>
              ))}
            </div>
          }
          title="Subtitle Details"
        >
          <Button size="small">{subtitles?.length || 0} segments</Button>
        </Popover>
      ),
      width: 150,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date?.$date).toLocaleString(),
      sorter: (a, b) =>
        new Date(a.created_at?.$date) - new Date(b.created_at?.$date),
      width: 180,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space>
          <ContentEditModal
            record={record}
            onSave={(record) => {
              updateRow(record);
            }}
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => deleteRow(record._id?.$oid)}
            danger
          />
        </Space>
      ),
    },
  ];
  const [data, setData] = useState([]);
  const [loading, setloading] = useState(false);
  const [floatgroup, setfloagroup] = useState(false);

  const deleteRow = (id) => {
    setloading(true);
    fetch(`http://127.0.0.1:5000/${id}`, {
      method: "DELETE",
    }).then(() => {
      setloading(false);
      setData(data.filter((item) => item._id?.$oid !== id));
    });
  };
  const updateRow = (record) => {
    setloading(true);
    fetch(`http://127.0.0.1:5000/${record._id?.$oid}`, {
      method: "PUT",
      body: JSON.stringify(record),
      "Content-Type": "application/json",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      setloading(false);
      fetchTable();
    });
  };
  const fetchTable = () => {
    setloading(true);
    fetch("http://127.0.0.1:5000/" + type)
      .then((res) => res.json())
      .then((data) => {
        setloading(false);
        setData(data);
      });
  };

  const createScript = () => {
    setloading(true);
    fetch("http://127.0.0.1:5000/create-script/" + type)
      .then((res) => res.json())
      .then((data) => {
        setloading(false);
        fetchTable();
      });
  };

  useEffect(() => {
    fetchTable();
  }, [type]);
  return (
    <>
      <Table dataSource={data} loading={loading} columns={columns} />
      <FloatButton.Group
        open={floatgroup}
        shape="circle"
        trigger="click"
        type="primary"
        icon={<QuestionCircleOutlined />}
        style={{ insetInlineEnd: 24 }}
        onClick={() => setfloagroup(!floatgroup)}
      >
        <FloatButton onClick={fetchTable} icon={<ReloadOutlined />} />
        <FloatButton onClick={createScript} icon={<PlusCircleOutlined />} />
        {/* <FloatButton.BackTop visibilityHeight={0} /> */}
      </FloatButton.Group>
    </>
  );
}

export default MainTable;
