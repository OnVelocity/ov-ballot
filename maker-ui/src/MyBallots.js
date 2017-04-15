/**
 * Created by onvelocity on 4/11/17.
 */
import React from 'react'
import { remove_ballot, set_ballot_to_edit, add_ballot_and_edit } from './Reducers'
import './MyBallots.css'

const MyBallots = ({ballots, dispatch}) => {

	const ballot = (ballot, index) => {

		const handleOnClickRemove = () => {
			dispatch(() => remove_ballot(ballot.id));
		};

		return (
			<li key={index} onClick={() => dispatch(() => set_ballot_to_edit(ballot.id))}>
				<span>{ballot.text}</span>
				<button onClick={(e) => {e.stopPropagation(); handleOnClickRemove();}}>&#10060;</button>
			</li>
		);

	};

	return (
		<ol className="MyBallots">
			{ballots.map(ballot)}
			<li><button onClick={() => dispatch(() => add_ballot_and_edit('new ballot'))}>Add ballot</button></li>
		</ol>
	);

};

export default MyBallots;
