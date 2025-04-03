import { gql } from "apollo-server-express";

export const typeDefs = gql`
  enum Role {
    ADMIN
    USER
  }

  enum PolicyStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    policies: [PolicyAssignment]
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Policy {
    id: ID!
    title: String!
    description: String!
    status: PolicyStatus!
    assignments: [PolicyAssignment]
  }

  type PolicyAssignment {
    id: ID!
    user: User!
    policy: Policy!
  }

  type Query {
    users: [User]
    policies: [Policy]
    policy(id: String!): Policy
    assignments: [PolicyAssignment!]!
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
      role: Role!
    ): User
    createPolicy(
      title: String!
      description: String!
      status: PolicyStatus!
    ): Policy
    signup(
      name: String!
      email: String!
      password: String!
      role: Role!
    ): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updatePolicy(
      id: String!
      title: String
      description: String
      status: PolicyStatus
    ): Policy
    deletePolicy(id: String!): String
  }
`;
