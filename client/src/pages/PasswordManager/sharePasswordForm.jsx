import { Form, Input, Button, message, Modal } from 'antd';
import axios from 'axios';

function ShareRequestModal({ visible, onCancel, onShare, password }) {
  const [form] = Form.useForm();

  const handleShare = async (values) => {
    try {
      await axios.post("/api/share/send", {
        ...values,
        passwordId: password._id,
      });
      message.success('Share request sent successfully');
      form.resetFields();
      onShare();
    } catch (error) {
      console.error("Failed to send share request:", error);
      message.error("Failed to send share request");
    }
  };

  return (
    <Modal
      visible={visible}
      title="Share Password"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="share" type="primary" onClick={() => form.submit()}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} onFinish={handleShare}>
        <Form.Item
          name="recipient"
          label="Recipient Username"
          rules={[
            { required: true, message: "Please enter the recipient username" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ShareRequestModal;