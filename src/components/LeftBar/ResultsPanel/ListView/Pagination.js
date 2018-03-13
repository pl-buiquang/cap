import React from 'react';

const propTypes = {
  items: React.PropTypes.array.isRequired,
  onChangePage: React.PropTypes.func.isRequired,
  initialPage: React.PropTypes.number  
}

const defaultProps = {
  initialPage: 1
}

const STYLE_UL = {
  display: 'flex',
  margin: '0',
  padding: '0',
  listStyle: 'none',
  justifyContent: 'space-between',
  width: '100%',
};

const STYLE_EL = {

}

const PAGE_SIZE = 10;

const range = (startPage, endPage) => {
  const myRange = [];
  for (var i = startPage; i < endPage; i++) {
    myRange.push(i);
  }
  return myRange;
}

const itemsHaveChanged = (prevItems, newItems) => {
  if (prevItems.length !== newItems.length) {
    return true;
  }
  for (var i = prevItems.length - 1; i >= 0; i--) {
    if (newItems[i].id !== prevItems[i].id){
      return true;
    }
  }
  return false;
}

class Pagination extends React.Component {

  state = { 
    pager: {} 
  };

  componentWillMount() {
  // set page if items array isn't empty
    if (this.props.items && this.props.items.length) {
      this.setPage(this.props.initialPage);
    }
  }

  componentWillReceiveProps(newProps) {
    if (itemsHaveChanged(this.props.items, newProps.items)) {
      this.setPage(this.props.initialPage);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // reset page if items array has changed
    if (itemsHaveChanged(prevProps.items, this.props.items)) {
      this.setPage(this.props.initialPage);
    }
  }

  setPage(page) {
    var items = this.props.items;
    var pager = this.state.pager;

    if (page < 1 || page > (pager.totalPages || Math.ceil(items.length / PAGE_SIZE))) {
      return;
    }

    // get new pager object for specified page
    pager = this.getPager(items.length, page, PAGE_SIZE);

    // get new page of items from items array
    var pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);

    // update state
    this.setState({ pager: pager });

    // call change page function in parent component
    this.props.onChangePage(pageOfItems);
  }

  getPager(totalItems, currentPage, pageSize) {
    // default to first page
    currentPage = currentPage || 1;

    // default page size is 10
    pageSize = pageSize || 10;

    // calculate total pages
    var totalPages = Math.ceil(totalItems / pageSize);

    var startPage, endPage;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // calculate start and end item indexes
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    var pages = range(startPage, endPage + 1);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  render() {
    var pager = this.state.pager;

    if (!pager.pages || pager.pages.length <= 1) {
      // don't display pager if there is only 1 page
      return null;
    }

    return (
      <ul className="cap-carto-pagination" style={STYLE_UL}>
        <li className={pager.currentPage === 1 ? 'cap-carto-pagination-item disabled' : 'cap-carto-pagination-item'}>
          <a className="cap-carto-pagination-item-link" onClick={() => this.setPage(1)}><i className="fa fa-angle-double-left" aria-hidden="true"></i></a>
        </li>
        <li className={pager.currentPage === 1 ? 'cap-carto-pagination-item disabled' : 'cap-carto-pagination-item'}>
          <a className="cap-carto-pagination-item-link" onClick={() => this.setPage(pager.currentPage - 1)}><i className="fa fa-angle-left" aria-hidden="true"></i></a>
        </li>
        {pager.pages.map((page, index) =>
          <li key={index} className={pager.currentPage === page ? 'cap-carto-pagination-item active' : 'cap-carto-pagination-item'}>
            <a className="cap-carto-pagination-item-link" onClick={() => this.setPage(page)}>{page}</a>
          </li>
        )}
        <li className={pager.currentPage === pager.totalPages ? 'cap-carto-pagination-item disabled' : 'cap-carto-pagination-item'}>
          <a className="cap-carto-pagination-item-link" onClick={() => this.setPage(pager.currentPage + 1)}><i className="fa fa-angle-right" aria-hidden="true"></i></a>
        </li>
        <li className={pager.currentPage === pager.totalPages ? 'cap-carto-pagination-item disabled' : 'cap-carto-pagination-item'}>
          <a className="cap-carto-pagination-item-link" onClick={() => this.setPage(pager.totalPages)}><i className="fa fa-angle-double-right" aria-hidden="true"></i></a>
        </li>
      </ul>
    );
  }
}

Pagination.propTypes = propTypes;
Pagination.defaultProps = defaultProps;

export default Pagination;