import * as React from "react";
import { Button, Panel } from "react-bootstrap";
import * as Cards from "../cards";

export interface IHandPanelProps { hand: Cards.Set; playerName: string }

export class HandPanel extends React.Component<IHandPanelProps, undefined> {
    public render() {
        return <Panel header={this.props.playerName} footer={'Total: ' + this.props.hand.getTotal()}>
            <h4>{this.props.hand.toCards()}</h4>
        </Panel>;
    }
}
