import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Form, Input, Row, TimePicker, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/features/alertSlice";
import moment from "moment";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  // ================= UPDATE DOCTOR =================
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());

      const res = await axios.post(
        "/api/v1/doctor/updateProfile",
        {
          ...values,
          userId: user?._id,
          timings: values.timings
            ? [
                moment(values.timings[0]).format("HH:mm"),
                moment(values.timings[1]).format("HH:mm"),
              ]
            : [],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  // ================= GET DOCTOR INFO =================
  const getDoctorInfo = async () => {
    try {
      if (!params?.id) {
        console.log("Doctor ID not found in URL");
        return;
      }

      dispatch(showLoading());

      const res = await axios.post(
        "/api/v1/doctor/getDoctorInfo",
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        setDoctor(res.data.data);
      } else {
        message.error("Failed to load doctor info");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Error loading doctor profile");
    }
  };

  useEffect(() => {
    getDoctorInfo();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <h1>Manage Profile</h1>

      {!doctor ? (
        <h3>Loading...</h3>
      ) : (
        <Form
          layout="vertical"
          onFinish={handleFinish}
          className="m-3"
          initialValues={{
            ...doctor,
            timings: doctor.timings
              ? [
                  moment(doctor.timings[0], "HH:mm"),
                  moment(doctor.timings[1], "HH:mm"),
                ]
              : [],
          }}
        >
          <h4>Personal Details :</h4>

          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Your first name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Your last name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Phone No"
                name="phone"
                rules={[{ required: true }]}
              >
                <Input placeholder="Your contact number" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true }]}
              >
                <Input type="email" placeholder="Your email address" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Website" name="website">
                <Input placeholder="Your website" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true }]}
              >
                <Input placeholder="Clinic address" />
              </Form.Item>
            </Col>
          </Row>

          <h4>Professional Details :</h4>

          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Specialization"
                name="specialization"
                rules={[{ required: true }]}
              >
                <Input placeholder="Your specialization" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Experience"
                name="experience"
                rules={[{ required: true }]}
              >
                <Input placeholder="Your experience" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Fees Per Consultation"
                name="feesPerCunsaltation"
                rules={[{ required: true }]}
              >
                <Input placeholder="Consultation fees" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Timings" name="timings">
                <TimePicker.RangePicker format="HH:mm" />
              </Form.Item>
            </Col>

            <Col xs={24} md={24} lg={8}>
              <button className="btn btn-primary form-btn" type="submit">
                Update
              </button>
            </Col>
          </Row>
        </Form>
      )}
    </Layout>
  );
};

export default Profile;
