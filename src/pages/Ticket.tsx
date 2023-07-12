import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/navbar";
import SearchNotificationBar from "../components/search";
import { Icon } from "@iconify/react";
import { Pagination } from "antd";
import { firestore } from "../firebase/config";

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
  const [tickets, setTickets] = useState<TicketData[]>([]);

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
                    <button>
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
    </StyledTicket>
  );
};

export default Ticket;
