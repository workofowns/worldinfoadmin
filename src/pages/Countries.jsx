import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Table, Image, Typography, Input, Spin, Empty } from "antd";
import { fetchDocument } from "../config/firebaseHelpers";
import { useDebounce } from "use-debounce";

const { Title } = Typography;
const { Search } = Input;

const Countries = () => {
  const [countryList, setCountryList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await fetchDocument("countriesList", "allCountries");
        setCountryList(data.countries || []);
        setFilteredList(data.countries || []);
      } catch (err) {
        setError("⚠️ Failed to load countries");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCountries();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setFilteredList(
        countryList.filter((country) =>
          country.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredList(countryList);
    }
  }, [debouncedSearchTerm, countryList]);

  const columns = useMemo(
    () => [
      {
        title: "Flag",
        dataIndex: "flags",
        key: "flag",
        render: (flags) => (
          <Image
            src={flags?.png}
            width={40}
            alt="flag"
            preview={false}
            className="rounded shadow-sm"
          />
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text) => <span className="font-semibold">{text}</span>,
      },
      {
        title: "Region",
        dataIndex: "region",
        key: "region",
      },
      {
        title: "Capital",
        dataIndex: "capital",
        key: "capital",
      },
       {
        title: "Population",
        dataIndex: "population",
        key: "population",
        sorter: (a, b) => a.population - b.population,
        render: (population) => population.toLocaleString(),
      },
      {
        title: "Currencies",
        dataIndex: "currencies",
        key: "currencies",
        render: (currencies) =>
          currencies?.map((c) => `${c.name} (${c.symbol})`).join(", "),
      },
      {
        title: "Languages",
        dataIndex: "languages",
        key: "languages",
        render: (langs) => langs?.map((lang) => lang.name).join(", "),
      },
    ],
    []
  );

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spin size="default"/>
      </div>
    );
  }

  if (error)
    return <div className="text-red-500 text-center font-medium">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <Title level={2} className="!mb-0 text-gray-800">
          🌍 All Countries
        </Title>
        <Search
          placeholder="Search country by name"
          allowClear
          enterButton
          size="large"
          onChange={handleSearchChange}
          className="w-full md:w-80"
        />
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 overflow-x-auto">
        <Table
          dataSource={filteredList}
          columns={columns}
          rowKey={(record) => record.alpha3Code}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          className="rounded-lg"
          locale={{
            emptyText: <Empty description="No countries found" />,
          }}
          footer={() => `Total Countries: ${filteredList.length}`}
        />
      </div>
    </div>
  );
};

export default Countries;