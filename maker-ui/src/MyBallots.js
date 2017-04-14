/**
 * Created by onvelocity on 4/11/17.
 */
import React from 'react'
import { remove_ballot, delete_ballots, set_ballot_to_edit, add_ballot } from './Reducers'
import './MyBallots.css'

const MyBallots = ({ballots, dispatch}) => {

	const ballot = (ballot, index) => {

		const handleOnClickRemove = () => {
			dispatch(() => delete_ballots([ballot.id]));
		};

		return (
			<li key={index} onClick={() => dispatch(() => set_ballot_to_edit(index))}>
				<span>{ballot.text}</span>
				<button onClick={(e) => {e.stopPropagation(); handleOnClickRemove();}}>&#10060;</button>
			</li>
		);

	};

	return (
		<ol className="MyBallots">
			{ballots.map(ballot)}
			<li><button onClick={() => dispatch(() => add_ballot('new ballot'))}>Add ballot</button></li>
		</ol>
	);

};

export default MyBallots;
