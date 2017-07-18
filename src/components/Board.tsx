import * as React from "react";
import { Alert, Button, ButtonToolbar, Grid, Row, Col, Panel } from "react-bootstrap";
import * as Cards from "../cards";
import { HandPanel } from "./HandPanel";

enum GameState {
    Playing,
    PlayerBust,
    DealerBust,
    PlayerWins,
    DealerWins,
    Draw,
    BlackJack,
}

export interface IBoardProps { compiler?: string; }
export interface IBoardState {
    deck?: Cards.Deck;
    playerHand?: Cards.Set;
    dealerHand?: Cards.Set;
    gameState?: GameState;
}

export class Board extends React.Component<IBoardProps, IBoardState> {

    constructor() {
        super();
        const deck = new Cards.Deck();
        deck.shuffle();
        const playerHand = new Cards.Set();
        playerHand.add(deck.draw(2));
        const dealerHand = new Cards.Set();
        dealerHand.add(deck.draw());
        this.state = {
            deck,
            playerHand,
            dealerHand,
            gameState: playerHand.getTotal() === 21 ? GameState.BlackJack : GameState.Playing,
        };
    }

    public deal = () => {
        const deck = new Cards.Deck();
        deck.shuffle();
        const playerHand = new Cards.Set();
        playerHand.add(deck.draw(2));
        const dealerHand = new Cards.Set();
        dealerHand.add(deck.draw());
        this.setState({
            deck,
            dealerHand,
            playerHand,
            gameState: playerHand.getTotal() === 21 ? GameState.BlackJack : GameState.Playing,
        });
    }

    public hit = () => {
        this.state.playerHand.add(this.state.deck.draw(1));
        this.setState({
            deck: this.state.deck,
            playerHand: this.state.playerHand,
        });
        if (this.state.playerHand.getTotal() > 21) {
            this.setState({
                gameState: GameState.PlayerBust,
            });
        } else if (this.state.playerHand.getTotal() === 21) {
            this.setState({
                gameState: GameState.BlackJack,
            });
        }
    }

    public stay = () => {
        // TODO: Dealer stuff here.
        const dealerHand = this.state.dealerHand;
        let newState: GameState;
        this.state.dealerHand.add(this.state.deck.draw());
        while (dealerHand.getTotal() < 17) {
            dealerHand.add(this.state.deck.draw(1));
        }
        if (dealerHand.getTotal() > 21) {
            newState = GameState.DealerBust;
        } else if (dealerHand.getTotal() < this.state.playerHand.getTotal()) {
            newState = GameState.PlayerWins;
        } else if (dealerHand.getTotal() > this.state.playerHand.getTotal()) {
            newState = GameState.DealerWins;
        } else {
            newState = GameState.Draw;
        }
        this.setState({
            dealerHand,
            gameState: newState,
        });
    }

    public displayGameState = () => {
        let text = "", style = "";
        switch (this.state.gameState) {
            case GameState.Playing:
                text = "Select an option";
                style = "info";
                break;

            case GameState.DealerBust:
                text = "Dealer Bust. You Win!";
                style = "success";
                break;

            case GameState.PlayerBust:
                text = "Bust! You Lose!";
                style = "danger";
                break;

            case GameState.PlayerWins:
                text = "You Win!";
                style = "success";
                break;

            case GameState.DealerWins:
                text = "You Lose!";
                style = "danger";
                break;

            case GameState.Draw:
                text = "Draw!";
                style = "info";
                break;

            case GameState.BlackJack:
                text = "Blackjack! You Win!";
                style = "success";
                break;
        }
        if (text !== "") {
            return <Alert bsStyle={style}>{text}</Alert>;
        }
    }

    public displayDealersHand = () => {
        if (this.state.dealerHand !== undefined) {
            return <HandPanel hand={this.state.dealerHand} playerName='Dealer' />;
        }
    }

    public render() {
        return <Grid>
            <Row>
                <Col xs={6} md={6}>
                    <HandPanel hand={this.state.playerHand} playerName='You'/>
                </Col>
                <Col xs={6} md={6}>
                {this.displayDealersHand()}
                </Col>
            </Row>
            {this.displayGameState()}
            <ButtonToolbar>
                {this.state.gameState === GameState.Playing ? (
                    <ButtonToolbar>
                        <Button bsSize='large' bsStyle="danger" onClick={this.hit}>Hit</Button>
                        <Button bsSize='large' bsStyle="success" onClick={this.stay}>Stay</Button>
                    </ButtonToolbar>
                ) : (
                    <Button bsSize='large' bsStyle="primary" onClick={this.deal}>Deal</Button>
                )}
            </ButtonToolbar>
        </Grid>;
    }
}
