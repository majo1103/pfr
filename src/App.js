import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
window.jQuery = window.$ = $;

class VoteItem extends Component {
    increment = (e) => {
        e.preventDefault();
        const model = this.props.item;
        model.votes = model.votes + 1;
        $.post('http://localhost:8000/answers/' + model.id, {
            'votes': model.votes
        }).then(function() {});
        const newVote = Object.assign({}, model);
        this.props.onUpdate(newVote); 
    }

    render() {
        const model = this.props.item;
        return (<li>{model.name}
            <div>
                <button className="btn btn-success" onClick={this.increment}>+1</button>&nbsp;
              <span>{model.votes}</span>
            </div>
        </li>);
    }
}

class VoteList extends Component {
    render() {
        const items = (vote, idx) => {
            return (<VoteItem key={idx} item={vote} onUpdate={this.props.onUpdate} />);
        };
        return (<ul id="items">{this.props.votes.map(items)}</ul>);
    }
}

class App extends Component {
    state = {
        error: null,
        isLoaded: false,
        items: []
    }

    componentDidMount() {
        fetch("http://localhost:8000/polls/1/answers")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    updateList = (update) => {
        this.setState(update);
    }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                <h1>What is your favorite programming language?</h1>
                <VoteList votes={items} onUpdate={this.updateList} />
                </div>);
        }
    }
}

export default App;