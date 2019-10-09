import React from "react";
import cx from "classnames";
import { connect } from "react-redux";
import { setFilter } from "../redux/actions";
import { VISIBILITY_FILTERS } from "../constants";

const VisibilityFilters = ({ activeFilter, setFilter }) => {
  return (
    <div className="visibility-filters">
      {Object.keys(VISIBILITY_FILTERS).map(filterKey => {
        const currentFilter = VISIBILITY_FILTERS[filterKey];
        return (
          <span
            key={`visibility-filter-${currentFilter}`}
            className={cx(
              "filter",
              currentFilter === activeFilter && "filter--active"
            )}
            onClick={() => {
              setFilter(currentFilter);
            }}
          >
            {currentFilter}
          </span>
        );
      })}
    </div>
  );
};

/**
 * 
 * @param {*} state state中的数据
 * @param {*} ownProps 指的是这个组件自已的props，<VisibilityFilters abc='1234'/>, 这里的ownProps={abc:'1234'}
 */
const mapStateToProps = (state, ownProps) => {
  console.log('VisibilityFilters-mapStateToProps', state, ownProps);
  return { activeFilter: state.visibilityFilter };
};

// export default VisibilityFilters;
export default connect(
  mapStateToProps,
  { setFilter }
)(VisibilityFilters);

// mapStateToProps 和 mapDispatchToProps 有很多种写法，我也是一脸懵逼
