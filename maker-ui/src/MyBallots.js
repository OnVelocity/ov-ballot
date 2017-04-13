/**
 * Created by onvelocity on 4/11/17.
 */
import React from 'react'
import { remove_ballot, set_ballot_to_edit } from './Reducers'
import './MyBallots.css'

const MyBallots = ({ballots, dispatch}) => {

	const ballot = (ballot, index) => {
		return (
			<li key={index} onClick={() => dispatch(() => set_ballot_to_edit(index))}>
				<span>{ballot.text}</span>
				<button onClick={() => dispatch(ballotIndex => remove_ballot(ballotIndex))}>&#10060;</button>
			</li>
		);
	};

	return (
		<ol className="MyBallots">
			{ballots.map(ballot)}
		</ol>
	);

};

export default MyBallots;
