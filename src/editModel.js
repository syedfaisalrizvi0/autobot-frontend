import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Switch,
  Divider,
  Space,
  Tag,
  message,
} from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const ContentEditModal = ({ record, onSave }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subtitleEditMode, setSubtitleEditMode] = useState(false);

  // Initialize form with record data
  const showModal = () => {
    form.setFieldsValue({
      ...record,
      created_at: record.created_at?.$date
        ? new Date(record.created_at.$date)
        : new Date(),
    });
    setVisible(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Transform data back to original format
      const updatedData = {
        ...values,
        _id: record._id,
        created_at: { $date: values.created_at.getTime() },
        subtitle: subtitleEditMode ? values.subtitle : record.subtitle, // Preserve original if not edited
      };

      await onSave(updatedData);
      message.success("Content updated successfully");
      setVisible(false);
    } catch (error) {
      message.error("Error updating content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="link" icon={<EditOutlined />} onClick={showModal} />
      <Modal
        title={`Edit Content: ${record.title}`}
        visible={visible}
        width={800}
        onCancel={() => setVisible(false)}
        footer={[
          <Button
            key="cancel"
            icon={<CloseOutlined />}
            onClick={() => setVisible(false)}
          >
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            loading={loading}
            onClick={handleSave}
          >
            Save Changes
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Divider orientation="left">Basic Information</Divider>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please input title!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="catagory"
              label="Category"
              rules={[{ required: true, message: "Please select category!" }]}
            >
              <Select>
                <Option value="22">Category 22</Option>
                <Option value="comedy">Comedy</Option>
                <Option value="education">Education</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="text"
            label="Content Text"
            rules={[{ required: true, message: "Please input content text!" }]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={2} />
          </Form.Item>

          <Divider orientation="left">Media Settings</Divider>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item name="taken" label="Taken" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>

            <Form.Item name="audio" label="Has Audio" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>

            <Form.Item name="video" label="Has Video" valuePropName="checked">
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </div>

          <Form.Item
            name="ready"
            label="Ready to Publish"
            valuePropName="checked"
          >
            <Switch checkedChildren="Ready" unCheckedChildren="Processing" />
          </Form.Item>

          <Form.Item
            name="disabled"
            label="is Disabled ?"
            valuePropName="checked"
          >
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>
          <Divider orientation="left">
            <Space>
              Subtitles
              <Button
                size="small"
                type="link"
                onClick={() => setSubtitleEditMode(!subtitleEditMode)}
              >
                {subtitleEditMode ? "View Mode" : "Edit Mode"}
              </Button>
            </Space>
          </Divider>

          {subtitleEditMode ? (
            <Form.List name="subtitle">
              {(fields) => (
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      style={{
                        marginBottom: 16,
                        padding: 8,
                        border: "1px solid #f0f0f0",
                        borderRadius: 4,
                      }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "text"]}
                        label="Subtitle Text"
                      >
                        <TextArea rows={2} />
                      </Form.Item>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "16px",
                        }}
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "start"]}
                          label="Start Time (s)"
                        >
                          <Input type="number" step="0.01" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "end"]}
                          label="End Time (s)"
                        >
                          <Input type="number" step="0.01" />
                        </Form.Item>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Form.List>
          ) : (
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {record.subtitle?.map((sub, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: 8,
                    padding: 8,
                    border: "1px solid #f0f0f0",
                    borderRadius: 4,
                  }}
                >
                  <p>
                    <strong>Text:</strong> {sub.text}
                  </p>
                  <p>
                    <strong>Time:</strong> {sub.start}s - {sub.end}s
                  </p>
                  <p>
                    <small>ID: {sub.id}</small>
                  </p>
                </div>
              ))}
            </div>
          )}

          <Form.Item name="created_at" label="Created At">
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ContentEditModal;
