# ov-ballot
a super simple ballot service built on AWS Serverless architecture that tracks ballot box

## Project Goal
The goal is to provide a way for voters to confirm their vote after the fact.

Using ideas from Blockchain to track ballot vote results we may be able to do just that.

## Micro-services

ov-ballot-maker
Create ballots, a simple list of questions and choices.

ov-voting-booth
Select choices on a given ballot and submit ballot to the ballot box.

ov-ballot-box
Tally the votes for each ballot submitted by a voter and return a voter verification code for the change to the ballot box.

ov-ballot-box-results
Show the latest counts by choice for each question in a given ballot.

ov-ballot-box-vote-validator
Validate a ballot was properly counted in the results given a voter verification code.

## Ballot Box Tally Process
Every change to the ballot box will be made in a verifiable, tamper proof way, as follows:

1. When a new ballot arrives in the ballot box, the service will extract the last ballot-box vote result.
We will call this newly arrived ballot, the NewBallot and the last ballot box vote result, the LastBallotBoxVoteResult.

2. A clone of the LastBallotBoxVoteResult is updated by adding 1 for the selected choices in the NewBallot.
This clone of the LastBallotBoxVoteResult will be called the NewBallotBoxVoteResult.

3. Only one choice per question is incremented by 1 in the NewBallotBoxVoteResult.
Any other deviation will cause NewBallot to be ignored and an appropriate error message returned.

4. The MD5 hashcode of the Voter Token will be copied to a field in the NewBallotBoxVoteResult.

5. The MD5 hashcode of the LastBallotBoxVoteResult will be copied to a field in the NewBallotBoxVoteResult.

6. The MD5 hashcode of the NewBallotBoxVoteResult will be used as the Id for entering the NewBallotBoxVoteResult in the ballot box database.

This process repeats for each new ballot that arrives in the ballot box.

The ballot box database table might look like this:
```
BallotBox: {
  Id: MD5(Block)
  Block: {
    Voter: MD5(Voter Token)
    Timestamp: DateTimeWithNanoseconds
    Previous Id: MD5(Previous BallotRox Entry Id)
    VoteTally: {
      Choice ID: Number of Votes
    }
  }
}
```

## Ballot Box Results Validation
The ballot box tally process provides the data provenance necessary to validate all changes made since the beginning of the ballot box.

A voter is given the MD5 hashcode of the resulting ballot box vote result after their vote is tallied.

To validate a vote was counted properly the voter can look at the vote tally prior to their vote and see the change their vote had on the tally.

By chaining the hashcode values in the ballot box vote results as described tampering with the results are virtually impossible.

Making the ballot-box results publicly visible and distributed further increases the resilience to tampering.

Since voter data is a black box, an MD5 hashcode of the Voter Token, for example, making the ballot box vote result changes visible is reasonable.

## Scale to Large Elections
Could an approach like this scale to very large elections?

From a technology perspective yes. One question is how expensive is validating the vote results post election.

If it took 400ms to validate a block in the chain and we had 300M blocks (aka votes) then serially validating the whole chain would take 23.15 days.

23.15 days = 400ms * 300M / 1000 / 60 / 60 / 24.

However, this task could be segmented and paralleled which could speed things up significantly.

I could imagine a system of blockchains that handle two kinds of transactions summary and vote. 

A vote transaction represents one vote. A summary transaction represents a rollup of vote tally results.

A BallotBox handles individual vote transactions and a SummaryBallotBox handles summary transactions.

In this way the ballot boxes could be distributed geographically, and rolled up by meaningful boundaries.

For example, each polling station rolls up to a district, which in turn rolls up to a town, then to a state and finally to a federal summary ballot box.

Or perhaps, if enough voters validated their vote on their own accord then a full validation of the chain would not be needed.

Another question is how much data would a very large election generate. 

If a ballot box vote result record is 4kb and we had 300M votes then the blockchain table would grow to roughly 1.2GB.

1.2GB = 4kb * 300M.

## Voter Identity Fraud
Verifying the identity of the voter and ensuring they cannot misrepresent their identity in some way is beyond the scope of this project.

As the goal states we want a voter to be able to simply know that their vote counted.

While this project does not address voter identity fraud, some types of voter fraud might be easier to detect and prevent.

For example, ensuring a Voter Token is not used more than once could be enforced in a blockchain in much the same way a bitcoin cannot be double spent.
