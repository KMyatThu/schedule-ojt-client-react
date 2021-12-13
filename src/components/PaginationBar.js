/**
 * @description Pagination Component for common usage
 * @param {object} pagination pagination info object
 * @param {Funtion} handlePagination pagination handler
 */
import React from "react";
import { Pagination } from "react-bootstrap";

export default function PaginationBar({
  BASE_API_ROUTE,
  pagination,
  fetchList
}) {
  /**
   * Handle pagination events
   * @param {string} type type of pagination[index, first, last, next, prev]
   * @param {number} index index of page
   * @param {object} event
   */
  const handlePagination = (type, index, event) => {
    event.preventDefault();
    const urlMap = {
      index: `${BASE_API_ROUTE}?page=${index}`,
      first: pagination.first_page_url,
      last: pagination.last_page_url,
      next: pagination.next_page_url,
      prev: pagination.prev_page_url
    };
    fetchList(urlMap[type]);
  };

  let paginationItemList = [];
  if (pagination.last_page > 0) {
    for (let index = 1; index <= pagination.last_page; index++) {
      paginationItemList.push(
        <Pagination.Item
          key={index}
          onClick={event => handlePagination("index", index, event)}
          active={pagination.current_page === index}
        >
          {index}
        </Pagination.Item>
      );
    }
  }
  return (
    <Pagination>
      {pagination.first_page_url && (
        <Pagination.First
          onClick={event => handlePagination("first", null, event)}
        />
      )}
      {pagination.prev_page_url && (
        <Pagination.Prev
          onClick={event => handlePagination("prev", null, event)}
        />
      )}
      {paginationItemList}
      {pagination.next_page_url && (
        <Pagination.Next
          onClick={event => handlePagination("next", null, event)}
        />
      )}
      {pagination.last_page_url && (
        <Pagination.Last
          onClick={event => handlePagination("last", null, event)}
        />
      )}
    </Pagination>
  );
}
