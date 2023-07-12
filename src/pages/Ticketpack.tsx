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

const StyledTicketpack = styled.div`
  background-color: #f9f6f4;
`;

const Ticketpack: React.FC = () => {
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
    <StyledTicketpack>
      <div className="app">
        <Navbar />
        <div className="container-main">
          <SearchNotificationBar />
          <div className="content">
            <div className="content-main">
              <div className="title">
                <h2 className="noo-sh-title">Danh sách gói vé</h2>
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
                <div>
                  <button className="filter-filter-1">Xuất file (.CSV)</button>

                  <button className="filter-filter-2">Thêm gói vé</button>
                </div>
              </div>
              <div className="ticket-table">
                <thead>
                  <tr className="cot">
                    <th>STT</th>
                    <th>Mã gói</th>
                    <th>Tên gói vé</th>
                    <th>Ngày áp dụng</th>
                    <th>Ngày hết hạn</th>
                    <th>Giá vé (VNĐ/Vé)</th>
                    <th>Giá combo (VNĐ/Combo)</th>
                    <th>Tình trạng</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>GOI001</td>
                    <td>Gói vé A</td>
                    <td>01/08/2023</td>
                    <td>31/12/2023</td>
                    <td>100,000</td>
                    <td>200,000</td>
                    <td>Hoạt động</td>
                    <td className="no-wrap1">
                      <Icon icon="lucide:edit" />
                      Cập nhật
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>GOI002</td>
                    <td>Gói vé B</td>
                    <td>01/09/2023</td>
                    <td>30/11/2023</td>
                    <td>150,000</td>
                    <td>250,000</td>
                    <td>Hoạt động</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>GOI003</td>
                    <td>Gói vé C</td>
                    <td>01/10/2023</td>
                    <td>31/12/2023</td>
                    <td>120,000</td>
                    <td>220,000</td>
                    <td>Hết hạn</td>
                    <td></td>
                  </tr>
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
    </StyledTicketpack>
  );
};

export default Ticketpack;
