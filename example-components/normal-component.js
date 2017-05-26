// @flow
import React, {Component, PropTypes as t} from 'react';
import StatusTabs from './StatusTabs';
import NewCarriersTable from './CarriersTable/NewInactiveTable/Table';
import ActiveCarriersTable from './CarriersTable/ActivesTable/Table';
import BaseTabBody from 'components/BaseTabBody';
import Pagination from 'components/shared/Pagination';

type State = {
  openForm: false,
};

export default class Tab extends Component {
  static propTypes = {
    carriersData: t.object.isRequired,
    carrierFlags: t.object.isRequired,
    usersData: t.object.isRequired,
    authData: t.object.isRequired,
    params: t.object,
    onDelete: t.func.isRequired,
    onSubmit: t.func.isRequired,
    onSortEvent: t.func.isRequired,
    currentUser: t.object.isRequired,
    handlePageLoad: t.func.isRequired,
  };

  state: State = {
    openForm: false,
  };

  _tableComponent() {
    if (this.props.params.tab === 'active') {
      return ActiveCarriersTable;
    }

    return NewCarriersTable;
  }

  render() {
    const Table = this._tableComponent();

    const {
      carriersData,
      carrierFlags,
      usersData,
      authData,
      currentUser,
      onSortEvent,
      onSubmit,
      onDelete,
    } = this.props;

    return (
      <div>
        <StatusTabs
          params={this.props.params}
          carriersData={this.props.carriersData}
        />

        <BaseTabBody
          data={{...carriersData, carrierFlags}}
          resourceName="records"
          resourceFlagsName="carrierFlags"
          hideSpacer
        >

          <Table
            carriersData={carriersData}
            usersData={usersData}
            authData={authData}
            onSortEvent={onSortEvent}
            currentUser={currentUser}
            onSubmit={onSubmit}
            onDelete={onDelete}
            tab={this.props.params.tab}
          />
        </BaseTabBody>

        {carriersData.meta.pagination
          ? <Pagination
              paginationData={carriersData.meta.pagination}
              onPageClick={this.props.handlePageLoad}
            />
          : null}

      </div>
    );
  }
}
