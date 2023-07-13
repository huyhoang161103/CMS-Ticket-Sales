import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/navbar";
import SearchNotificationBar from "../components/search";
import { Icon } from "@iconify/react";
import { Pagination, Select } from "antd";
import { firestore } from "../firebase/config";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";
import { TimePicker } from "antd";
import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";

interface TicketPack {
  applicationDate: String;
  comboPrice: String;
  expirationDate: String;
  packageCode: string;
  packageName: string;
  status: string;
  ticketPrice: String;
}

const StyledTicketpack = styled.div`
  background-color: #f9f6f4;
`;

const Ticketpack: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 6;

  const [packageName, setPackageName] = useState("");
  const [applicationDate, setApplicationDate] = useState<Date | null>(null);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [ticketPrice, setTicketPrice] = useState("");
  const [comboPrice, setComboPrice] = useState("");
  const [status, setStatus] = useState("");

  const [showOverlay, setShowOverlay] = useState(false);

  const [selectedTicketPack, setSelectedTicketPack] = useState(false);

  const generatePackageCode = () => {
    const randomNumber = Math.floor(Math.random() * 100);

    return `ALT${randomNumber}`;
  };

  const handleCheckboxChange = (e: CheckboxChangeEvent) => {
    console.log(e.target.checked);
  };
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const [ticketPacks, setTicketPacks] = useState<TicketPack[]>([]);

  useEffect(() => {
    const fetchTicketPacks = async () => {
      try {
        const snapshot = await firestore.collection("ticketpack").get();
        const ticketPackData = snapshot.docs.map(
          (doc) => doc.data() as TicketPack
        );
        setTicketPacks(ticketPackData);
      } catch (error) {
        console.error("Error fetching ticket packs:", error);
      }
    };

    fetchTicketPacks();
  }, []);

  const handleSaveOverlay = async () => {
    const packageCode = generatePackageCode();
    const ticketPackData: TicketPack = {
      packageCode,
      packageName,
      applicationDate: applicationDate?.toLocaleDateString() ?? "",
      expirationDate: expirationDate?.toLocaleDateString() ?? "",
      ticketPrice,
      comboPrice,
      status,
    };

    try {
      await firestore.collection("ticketpack").add(ticketPackData);
      setShowOverlay(false);
      window.location.reload();
    } catch (error) {
      console.error("Error saving ticket pack:", error);
    }
  };

  const handleSelectChange = (
    value: string | null,
    option:
      | { value: string; label: string }
      | { value: string; label: string }[]
  ) => {
    const selectedLabel = Array.isArray(option)
      ? option[0]?.label
      : option?.label;
    console.log(selectedLabel);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditTicketPack = () => {
    setSelectedTicketPack(true);
  };

  const handleCancelEditOverlay = () => {
    setSelectedTicketPack(false);
  };

  const handleFilterButtonClick = () => {
    setShowOverlay(true);
  };

  const handleCancelOverlay = () => {
    setShowOverlay(false);
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

                  <button
                    onClick={handleFilterButtonClick}
                    className="filter-filter-2"
                  >
                    Thêm gói vé
                  </button>
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
                  {ticketPacks
                    .slice(
                      (currentPage - 1) * rowsPerPage,
                      currentPage * rowsPerPage
                    )
                    .map((ticketPack, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{ticketPack.packageCode}</td>
                        <td className="no-wrap">{ticketPack.packageName}</td>
                        <td>{ticketPack.applicationDate}</td>
                        <td>{ticketPack.expirationDate}</td>
                        <td>{ticketPack.ticketPrice}&#8363;</td>
                        <td>{ticketPack.comboPrice}&#8363;</td>
                        <td className="no-wrap">
                          <span
                            className={
                              ticketPack.status === "Đang áp dụng"
                                ? "not-used"
                                : ticketPack.status === "Tắt"
                                ? "expired"
                                : ""
                            }
                          >
                            <Icon
                              icon="ion:ellipse"
                              style={{ marginRight: "8px" }}
                            />
                            {ticketPack.status}
                          </span>
                        </td>
                        <td className="no-wrap1" onClick={handleEditTicketPack}>
                          <Icon icon="lucide:edit" />
                          Cập nhật
                        </td>
                      </tr>
                    ))}
                </tbody>

                <div className="pagination-container pagination-fixed">
                  <Pagination
                    current={currentPage}
                    pageSize={rowsPerPage}
                    total={ticketPacks.length}
                    onChange={handlePageChange}
                    className="custom-pagination"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedTicketPack && (
        <div className="overlay">
          <div className="overlay-content">
            <p>Cập nhật thông tin gói vé</p>
            <div className="overlay-filter">
              <div className="row pt-2">
                <div className="col">
                  <span>
                    Mã sự kiện <span className="red">*</span>
                  </span>
                </div>
                <div className="col">Tên sự kiện</div>
              </div>
              <div className="row pt-1">
                <div className="col">
                  <input type="text" value={"PKG20210502"} />
                </div>
                <div className="col">
                  <input
                    type="text"
                    value={"Hội chợ triển lãm hàng tiêu dùng 2021"}
                  />
                </div>
              </div>
              <div className="row pt-3">
                <div className="col">
                  <span>Ngày áp dụng </span>
                </div>
                <div className="col">
                  <span>Ngày hết hạn</span>
                </div>
              </div>
              <div className="row pt-2">
                <div className="col">
                  <div className="row">
                    <div className="col">
                      {" "}
                      <Space direction="vertical">
                        <DatePicker onChange={onChange} format="DD/MM/YYYY" />
                      </Space>
                    </div>
                    <div className="col">
                      <Space wrap>
                        <TimePicker use12Hours onChange={onChange} />
                      </Space>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="row">
                    <div className="col">
                      {" "}
                      <Space direction="vertical">
                        <DatePicker onChange={onChange} format="DD/MM/YYYY" />
                      </Space>
                    </div>
                    <div className="col">
                      <Space wrap>
                        <TimePicker use12Hours onChange={onChange} />
                      </Space>
                    </div>
                  </div>
                </div>
                <col />
              </div>
              <div className="row pt-3">
                <span>Giá vé áp dụng</span>
              </div>
              <div className="row pt-2">
                <div className="checkbox-input-row">
                  <Checkbox onChange={handleCheckboxChange}>
                    Vé lẻ (vnđ/vé) với giá
                  </Checkbox>
                  <input
                    type="text"
                    className="input-price"
                    placeholder="Giá vé"
                  />
                  /vé
                </div>
              </div>
              <div className="row pt-2">
                <div className="checkbox-input-row">
                  <Checkbox onChange={handleCheckboxChange}>
                    Combo vé với giá
                  </Checkbox>
                  <input
                    type="text"
                    className="input-price"
                    placeholder="Giá vé"
                  />
                  /
                  <input
                    type="text"
                    className="input-price"
                    placeholder="Giá vé"
                  />
                  /vé
                </div>
              </div>
              <div className="row pt-3">
                <span>Tình trạng</span>
              </div>
              <div className="row pt-2">
                <div className="">
                  <Select
                    className="select-ticket"
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={handleSelectChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        value: "dangapdung",
                        label: "Đang áp dụng",
                      },
                      {
                        value: "tat",
                        label: "Tắt",
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="row pt-2">
                <span>
                  <span className="red">*</span> là thông tin bắt buộc
                </span>
              </div>
            </div>
            <div className="pt-4">
              <div className="huyluu">
                <button
                  className="filter-filter-3"
                  onClick={handleCancelEditOverlay}
                >
                  Hủy
                </button>

                <button
                  className="filter-filter-4"
                  onClick={handleCancelEditOverlay}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <p>Thêm gói vé</p>
            <div className="overlay-filter">
              <div className="row pt-2">
                <div className="col">
                  <span>
                    Tên gói vé <span className="red">*</span>
                  </span>
                </div>
              </div>
              <div className="row pt-1">
                <div className="col">
                  <input
                    required
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                  />
                </div>
              </div>
              <div className="row pt-3">
                <div className="col">
                  <span>Ngày áp dụng </span>
                </div>
                <div className="col">
                  <span>Ngày hết hạn</span>
                </div>
              </div>
              <div className="row pt-2">
                <div className="col">
                  <div className="row">
                    <div className="col">
                      {" "}
                      <Space direction="vertical">
                        <DatePicker
                          onChange={(date) =>
                            setApplicationDate(date?.toDate() || null)
                          }
                          format="DD/MM/YYYY"
                        />
                      </Space>
                    </div>
                    <div className="col">
                      <Space wrap>
                        <TimePicker use12Hours onChange={onChange} />
                      </Space>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="row">
                    <div className="col">
                      {" "}
                      <Space direction="vertical">
                        <DatePicker
                          onChange={(date) =>
                            setExpirationDate(date?.toDate() || null)
                          }
                          format="DD/MM/YYYY"
                        />
                      </Space>
                    </div>
                    <div className="col">
                      <Space wrap>
                        <TimePicker use12Hours onChange={onChange} />
                      </Space>
                    </div>
                  </div>
                </div>
                <col />
              </div>
              <div className="row pt-3">
                <span>Giá vé áp dụng</span>
              </div>
              <div className="row pt-2">
                <div className="checkbox-input-row">
                  <Checkbox onChange={handleCheckboxChange}>
                    Vé lẻ (vnđ/vé) với giá
                  </Checkbox>
                  <input
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    type="text"
                    className="input-price"
                    placeholder="Giá vé"
                  />
                  /vé
                </div>
              </div>
              <div className="row pt-2">
                <div className="checkbox-input-row">
                  <Checkbox onChange={handleCheckboxChange}>
                    Combo vé với giá
                  </Checkbox>
                  <input
                    value={comboPrice}
                    onChange={(e) => setComboPrice(e.target.value)}
                    type="text"
                    className="input-price"
                    placeholder="Giá vé"
                  />
                  /
                  <input
                    type="text"
                    className="input-price"
                    placeholder="Giá vé"
                  />
                  /vé
                </div>
              </div>
              <div className="row pt-3">
                <span>Tình trạng</span>
              </div>
              <div className="row pt-2">
                <div className="">
                  <Select
                    className="select-ticket"
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={(label) => setStatus(label)}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={[
                      {
                        value: "Đang áp dụng",
                        label: "Đang áp dụng",
                      },
                      {
                        value: "Tắt",
                        label: "Tắt",
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="row pt-2">
                <span>
                  <span className="red">*</span> là thông tin bắt buộc
                </span>
              </div>
            </div>
            <div className="pt-4">
              <div className="huyluu">
                <button
                  className="filter-filter-3"
                  onClick={handleCancelOverlay}
                >
                  Hủy
                </button>

                <button className="filter-filter-4" onClick={handleSaveOverlay}>
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StyledTicketpack>
  );
};

export default Ticketpack;
