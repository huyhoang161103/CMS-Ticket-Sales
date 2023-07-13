import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/navbar";
import SearchNotificationBar from "../components/search";
import { Icon } from "@iconify/react";
import { Pagination } from "antd";
import { firestore } from "../firebase/config";
import { Radio } from "antd";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import { Checkbox, Col, Row } from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";

interface TicketData {
  bookingCode: string;
  ticketNumber: string;
  usageStatus: string;
  usageDate: string;
  ticketDate: string;
  checkInGate: string;
}

const StyledTicket = styled.div`
  background-color: #f9f6f4;
`;

const Ticket: React.FC = () => {
  const [filterValue, setFilterValue] = useState<string[]>([]);
  const [defaultValue, setDefaultValue] = useState("tatca");

  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const [checkAll, setCheckAll] = useState(false);

  const handleCheckAllChange = (e: any) => {
    const checked = e.target.checked;
    setFilterValue(checked ? ["tatcacong"] : []);
    setCheckAll(checked);
  };

  const handleCheckboxChange = (checkedValues: CheckboxValueType[]) => {
    if (checkedValues.includes("tatcacong")) {
      setCheckAll(true);
      setFilterValue(["tatcacong"]);
    } else {
      setCheckAll(false);
      setFilterValue(checkedValues as string[]);
    }
  };

  const handleChange = (e: any) => {
    setDefaultValue(e.target.value);
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const snapshot = await firestore.collection("tickets").get();
        const ticketData = snapshot.docs.map((doc) => doc.data() as TicketData);
        setTickets(ticketData);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  const handlePageChange = (page: number) => {
    console.log("Current page:", page);
  };

  const handleFilterButtonClick = () => {
    setShowOverlay(true);
  };

  const handleCancelOverlay = () => {
    setShowOverlay(false);
  };

  return (
    <StyledTicket>
      <div className="app">
        <Navbar />
        <div className="container-main">
          <SearchNotificationBar />
          <div className="content">
            <div className="content-main">
              <div className="title">
                <h2 className="noo-sh-title">Danh sách vé</h2>
              </div>
              <div className="search-filter">
                <div className="search-ticket">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm bằng số vé"
                  />
                  <Icon
                    icon="material-symbols:search"
                    className="search-ticket-icon"
                  />
                </div>
                <div className="filter">
                  <div>
                    <button onClick={handleFilterButtonClick}>
                      <Icon icon="lucide:filter" className="icon-ticket" />
                      Lọc vé
                    </button>
                    <button>Xuất file (.CSV)</button>
                  </div>
                </div>
              </div>
              <div className="ticket-table">
                <thead>
                  <tr className="cot">
                    <th>STT</th>
                    <th>Booking Code</th>
                    <th>Số vé</th>
                    <th>Tình trạng sử dụng</th>
                    <th>Ngày sử dụng</th>
                    <th>Ngày xuất vé</th>
                    <th>Cổng check-in</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{ticket.bookingCode}</td>
                      <td>{ticket.ticketNumber}</td>
                      <td>
                        <span
                          className={
                            ticket.usageStatus === "Đã sử dụng"
                              ? "used"
                              : ticket.usageStatus === "Chưa sử dụng"
                              ? "not-used"
                              : ticket.usageStatus === "Hết hạn"
                              ? "expired"
                              : ""
                          }
                        >
                          <Icon
                            icon="ion:ellipse"
                            style={{ marginRight: "8px" }}
                          />
                          {ticket.usageStatus}
                        </span>
                      </td>
                      <td>{ticket.usageDate}</td>
                      <td>{ticket.ticketDate}</td>
                      <td>
                        {ticket.checkInGate ? (
                          ticket.checkInGate
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td>
                        {ticket.usageStatus === "Chưa sử dụng" &&
                        !ticket.checkInGate ? (
                          <Icon icon="nimbus:ellipsis" />
                        ) : ticket.usageStatus === "Đã sử dụng" ||
                          ticket.usageStatus === "Hết hạn" ? (
                          ""
                        ) : (
                          ticket.checkInGate
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <div className="pagination-container">
                  <Pagination
                    defaultCurrent={1}
                    total={50}
                    onChange={handlePageChange}
                    className="custom-pagination"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content-1">
            <p>Lọc vé</p>
            <div className="overlay-filter">
              <div className="row pt-2">
                <div className="col">
                  <span>Từ ngày</span>
                </div>
                <div className="col">
                  <span>Đến ngày</span>
                </div>
              </div>
              <div className="row pt-2">
                <div className="col">
                  <Space direction="vertical">
                    <DatePicker onChange={onChange} format="DD/MM/YYYY" />
                  </Space>
                </div>
                <div className="col">
                  <Space direction="vertical">
                    <DatePicker onChange={onChange} format="DD/MM/YYYY" />
                  </Space>
                </div>
              </div>
              <div className="row pt-3">
                <span>Tình trạng sử dụng</span>
              </div>
              <div className="row pt-2">
                <Radio.Group
                  name="radiogroup"
                  value={defaultValue}
                  onChange={handleChange}
                  className="d-flex justify-content-between"
                >
                  <Radio value="tatca">Tất cả</Radio>
                  <Radio value="dasd">Đã sử dụng</Radio>
                  <Radio value="chuasd">Chưa sử dụng</Radio>
                  <Radio value="hethan">Hết hạn</Radio>
                </Radio.Group>
              </div>
              <div className="row pt-3">
                <span>Cổng check-in</span>
              </div>
              <div className="row pt-2">
                <Checkbox.Group
                  style={{ width: "100%" }}
                  value={filterValue}
                  onChange={handleCheckboxChange}
                >
                  <Row>
                    <Col span={8}>
                      <Checkbox
                        value="tatcacong"
                        onChange={handleCheckAllChange}
                        checked={checkAll}
                      >
                        Tất cả
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="cong1" disabled={checkAll}>
                        Cổng 1
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="cong2" disabled={checkAll}>
                        Cổng 2
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="cong3" disabled={checkAll}>
                        Cổng 3
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="cong4" disabled={checkAll}>
                        Cổng 4
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="cong5" disabled={checkAll}>
                        Cổng 5
                      </Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </div>
            </div>
            <div className="filter pt-4">
              <div className="filter-ticket">
                <button onClick={handleCancelOverlay}>Lọc</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StyledTicket>
  );
};

export default Ticket;
