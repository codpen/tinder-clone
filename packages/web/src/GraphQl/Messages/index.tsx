import gql from 'graphql-tag'

export const MessagesQuery = gql`
    query MessagesQuery($matchId: ID!) {
        messages(matchId: $matchId) {
            id
            userId
            text
        }
    }
`
export const CreateMessageMutation = gql`
    mutation CreateMessageMutation(
        $matchId: Int!
        $userId: Int!
        $text: String!
    ) {
        createMessage(
            input: { matchId: $matchId, userId: $userId, text: $text }
        )
    }
`
export const MessagesSubscription = gql`
    subscription onCreatedMessage($matchId: ID!) {
        createdMessage(matchId: $matchId) {
            id
            userId
            text
        }
    }
`
