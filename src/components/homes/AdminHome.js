import React, { Component } from 'react';
import Jumbotron from '../site/Jumbotron';
import StoreOwner from '../manage/StoreOwner';

class AdminHome extends Component {
    state = {  }
    render() {
        return (
            <main role="main">
                <Jumbotron
                title="Manage Owners"
                subtitle="Add or remove store owners to the marketplace."
                />
                <div className="container-fluid">
                <StoreOwner web3={this.props.web3}
                        account={this.props.account}
                        instance={this.props.instance} />
                </div>
            </main>
        );
    }
}

export default AdminHome;