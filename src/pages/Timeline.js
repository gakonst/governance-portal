import React, { Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import VoterStatus from '../components/VoterStatus';
import { VotePercentage } from '../components/VoteTally';
import WithTally from '../components/hocs/WithTally';
import Button from '../components/Button';
import Card from '../components/Card';
import { toSlug } from '../utils/misc';
import { fonts } from '../theme';
import { modalOpen } from '../reducers/modal';
import { getActiveAccount } from '../reducers/accounts';
import Vote from '../components/modals/Vote';

const Heading = styled.p`
  color: #1f2c3c;
  font-size: ${fonts.size.xlarge};
  font-weight: ${fonts.weight.medium};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  flex: none;
  position: relative;
  @media screen and (max-width: 736px) {
    display: ${({ isAlwaysVisible }) => (isAlwaysVisible ? 'block' : 'none')};
  }
`;

const SubHeading = styled.p`
  color: #1f2c3c;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: ${fonts.size.large};
  font-weight: ${fonts.weight.medium};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  flex: none;
  position: relative;
  @media screen and (max-width: 736px) {
    display: ${({ isAlwaysVisible }) => (isAlwaysVisible ? 'block' : 'none')};
  }
`;

const Body = styled.p`
  font-size: 16px;
  line-height: 26px;
  height: 52px;
  color: #546978;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProposalDetails = styled.div`
  max-width: 59%;
  flex-direction: column;
  height: 100%;
  display: flex;
  justify-content: space-around;
`;

const StyledCard = styled(Card)`
  margin-bottom: 30px;
`;

const RootWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 26px;
  align-items: center;
`;

const Timeline = ({ modalOpen, topics, hatAddress, canVote, fetching }) => (
  <Fragment>
    <VoterStatus />
    <StyledCard>
      <RootWrapper>
        <div>
          <Heading>Current Root Proposal</Heading>
          <div style={{ display: 'flex' }}>
            <a>What is the Root Proposal?</a>
          </div>
        </div>
        <div>
          <WithTally candidate={hatAddress}>
            {({ loadingPercentage, percentage }) => (
              <VotePercentage
                loadingPercentage={loadingPercentage}
                percentage={percentage}
                noMargins
              />
            )}
          </WithTally>
        </div>
      </RootWrapper>
    </StyledCard>
    {topics.map(topic => (
      <StyledCard key={topic.topic}>
        <Card.Top
          govVote={topic.govVote}
          active={topic.active}
          topicTitle={topic.topic}
          collapsable={true}
          startCollapsed={false}
        />
        {topic.proposals.map(proposal => (
          <Card.Element key={proposal.title} height={137}>
            <ProposalDetails>
              <Link to={`/${toSlug(topic.topic)}/${toSlug(proposal.title)}`}>
                <SubHeading>{proposal.title}</SubHeading>
              </Link>
              <Body
                dangerouslySetInnerHTML={{ __html: proposal.proposal_blurb }}
              />
            </ProposalDetails>
            <div>
              <WithTally candidate={proposal.source}>
                {({ loadingPercentage, percentage }) => (
                  <VotePercentage
                    loadingPercentage={loadingPercentage}
                    percentage={percentage}
                  />
                )}
              </WithTally>
              <Button
                disabled={!canVote}
                loading={fetching}
                onClick={() =>
                  modalOpen(Vote, {
                    proposal: {
                      address: proposal.source,
                      title: proposal.title
                    }
                  })
                }
              >
                Vote for this Proposal
              </Button>
            </div>
          </Card.Element>
        ))}
      </StyledCard>
    ))}
  </Fragment>
);

const reduxProps = ({ topics, accounts, hat }) => {
  const activeAccount = getActiveAccount({ accounts });
  return {
    topics,
    fetching: accounts.fetching,
    canVote: activeAccount && activeAccount.hasProxy,
    hatAddress: hat.hatAddress
  };
};

export default connect(
  reduxProps,
  { modalOpen }
)(Timeline);
