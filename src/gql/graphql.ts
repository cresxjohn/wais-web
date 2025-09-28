/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
};

export type Account = {
  __typename?: 'Account';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  type: AccountType;
  updatedAt: Scalars['DateTime']['output'];
};

export type AccountType =
  | 'CASH'
  | 'CHECKING'
  | 'CREDIT_CARD'
  | 'INSURANCE'
  | 'LINE_OF_CREDIT'
  | 'LOAN'
  | 'SAVINGS';

export type AuthTokenResponse = {
  __typename?: 'AuthTokenResponse';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type CashAccountDetailsInput = {
  interestRatePerAnnum?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateAccountInput = {
  balance: Scalars['Float']['input'];
  cashDetails?: InputMaybe<CashAccountDetailsInput>;
  creditDetails?: InputMaybe<CreditAccountDetailsInput>;
  loanDetails?: InputMaybe<LoanDetailsInput>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  openedDate: Scalars['String']['input'];
  type: AccountType;
};

export type CreatePaymentInput = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  amount: Scalars['Float']['input'];
  category?: InputMaybe<Scalars['String']['input']>;
  fromAccountId?: InputMaybe<Scalars['String']['input']>;
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  recurrenceRule?: InputMaybe<CreateRecurrenceRuleInput>;
  startDate: Scalars['DateTime']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  toAccountId?: InputMaybe<Scalars['String']['input']>;
  type: PaymentType;
};

export type CreateRecurrenceRuleInput = {
  endAfterOccurrences?: InputMaybe<Scalars['Int']['input']>;
  endCondition: EndConditionType;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  frequency: RecurrenceFrequency;
  interval: Scalars['Int']['input'];
  monthlyRule?: InputMaybe<MonthlyRecurrenceRuleInput>;
  weeklyRule?: InputMaybe<WeeklyRecurrenceRuleInput>;
};

export type CreditAccountDetailsInput = {
  availableCredit: Scalars['Float']['input'];
  creditLimit: Scalars['Float']['input'];
  dueDateDaysAfterStatement: Scalars['Int']['input'];
  financeChargeInterestRate: Scalars['Float']['input'];
  statementDate: Scalars['Int']['input'];
};

export type DayOfWeek =
  | 'FRIDAY'
  | 'MONDAY'
  | 'SATURDAY'
  | 'SUNDAY'
  | 'THURSDAY'
  | 'TUESDAY'
  | 'WEDNESDAY';

export type EndConditionType =
  | 'AFTER_OCCURRENCES'
  | 'NEVER'
  | 'ON_DATE';

export type LoanDetailsInput = {
  interestRate: Scalars['Float']['input'];
  loanType: LoanType;
  maturityDate: Scalars['DateTime']['input'];
  nextPaymentAmount: Scalars['Float']['input'];
  nextPaymentDate: Scalars['DateTime']['input'];
  originalPrincipal: Scalars['Float']['input'];
  termMonths: Scalars['Int']['input'];
};

export type LoanType =
  | 'AUTO'
  | 'BUSINESS'
  | 'MORTGAGE'
  | 'PAG_IBIG'
  | 'PERSONAL'
  | 'SALARY'
  | 'SSS';

export type MeResponse = {
  __typename?: 'MeResponse';
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type MonthlyRecurrenceRule = {
  __typename?: 'MonthlyRecurrenceRule';
  dayOfMonth?: Maybe<Scalars['Int']['output']>;
  dayOfWeek?: Maybe<DayOfWeek>;
  id: Scalars['ID']['output'];
  type: MonthlyRecurrenceType;
  weekOfMonth?: Maybe<WeekOfMonth>;
};

export type MonthlyRecurrenceRuleInput = {
  dayOfMonth?: InputMaybe<Scalars['Int']['input']>;
  dayOfWeek?: InputMaybe<DayOfWeek>;
  type: MonthlyRecurrenceType;
  weekOfMonth?: InputMaybe<WeekOfMonth>;
};

export type MonthlyRecurrenceType =
  | 'ON_DAY_OF_MONTH'
  | 'ON_NTH_DAY_OF_WEEK';

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: Account;
  createPayment: Payment;
  logout: Scalars['Boolean']['output'];
  populateTransactions: Array<Transaction>;
  refreshToken: AuthTokenResponse;
  removeAccount: Account;
  removePayment: Payment;
  signIn: AuthTokenResponse;
  signInWithFacebook: AuthTokenResponse;
  signInWithGoogle: AuthTokenResponse;
  signUp: AuthTokenResponse;
  updateAccount: Account;
  updatePayment: Payment;
};


export type MutationCreateAccountArgs = {
  createAccountInput: CreateAccountInput;
};


export type MutationCreatePaymentArgs = {
  createPaymentInput: CreatePaymentInput;
};


export type MutationPopulateTransactionsArgs = {
  paymentId: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationRemoveAccountArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemovePaymentArgs = {
  id: Scalars['String']['input'];
};


export type MutationSignInArgs = {
  signInInput: SignInInput;
};


export type MutationSignInWithGoogleArgs = {
  idToken: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  signUpInput: SignUpInput;
};


export type MutationUpdateAccountArgs = {
  updateAccountInput: UpdateAccountInput;
};


export type MutationUpdatePaymentArgs = {
  updatePaymentInput: UpdatePaymentInput;
};

export type Payment = {
  __typename?: 'Payment';
  accountId?: Maybe<Scalars['String']['output']>;
  amount: Scalars['Float']['output'];
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  fromAccountId?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  link?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  recurrenceRule?: Maybe<RecurrenceRule>;
  tags: Array<Scalars['String']['output']>;
  toAccountId?: Maybe<Scalars['String']['output']>;
  transactions: Array<Transaction>;
  type: PaymentType;
  updatedAt: Scalars['DateTime']['output'];
};

export type PaymentType =
  | 'EXPENSE'
  | 'INCOME'
  | 'TRANSFER';

export type Query = {
  __typename?: 'Query';
  account: Account;
  accounts: Array<Account>;
  findPayments: Array<Payment>;
  findTransactions: Array<Transaction>;
  findUpcomingPayments: Array<Payment>;
  me: MeResponse;
};


export type QueryAccountArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindTransactionsArgs = {
  accountId: Scalars['String']['input'];
  from: Scalars['DateTime']['input'];
  to: Scalars['DateTime']['input'];
};

export type RecurrenceFrequency =
  | 'DAILY'
  | 'MONTHLY'
  | 'WEEKLY'
  | 'YEARLY';

export type RecurrenceRule = {
  __typename?: 'RecurrenceRule';
  endAfterOccurrences?: Maybe<Scalars['Int']['output']>;
  endCondition: EndConditionType;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  frequency: RecurrenceFrequency;
  id: Scalars['ID']['output'];
  interval: Scalars['Int']['output'];
  monthlyRule?: Maybe<MonthlyRecurrenceRule>;
  weeklyRule?: Maybe<WeeklyRecurrenceRule>;
};

export type SignInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  date: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  transferGroupId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UpdateAccountInput = {
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<AccountType>;
};

export type UpdatePaymentInput = {
  accountId?: InputMaybe<Scalars['String']['input']>;
  amount: Scalars['Float']['input'];
  category?: InputMaybe<Scalars['String']['input']>;
  fromAccountId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  recurrenceRule?: InputMaybe<CreateRecurrenceRuleInput>;
  startDate: Scalars['DateTime']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  toAccountId?: InputMaybe<Scalars['String']['input']>;
  type: PaymentType;
};

export type WeekOfMonth =
  | 'FIRST'
  | 'FOURTH'
  | 'LAST'
  | 'SECOND'
  | 'THIRD';

export type WeeklyRecurrenceRule = {
  __typename?: 'WeeklyRecurrenceRule';
  daysOfWeek: Array<DayOfWeek>;
  id: Scalars['ID']['output'];
};

export type WeeklyRecurrenceRuleInput = {
  daysOfWeek: Array<DayOfWeek>;
};

export type SignUpMutationVariables = Exact<{
  signUpInput: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'AuthTokenResponse', accessToken: string, refreshToken: string } };

export type SignInMutationVariables = Exact<{
  signInInput: SignInInput;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'AuthTokenResponse', accessToken: string, refreshToken: string } };

export type SignInWithGoogleMutationVariables = Exact<{
  idToken: Scalars['String']['input'];
}>;


export type SignInWithGoogleMutation = { __typename?: 'Mutation', signInWithGoogle: { __typename?: 'AuthTokenResponse', accessToken: string, refreshToken: string } };

export type RefreshTokenMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthTokenResponse', accessToken: string, refreshToken: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'MeResponse', id: string, name?: string | null, email?: string | null } };


export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"signUpInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"signUpInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"signUpInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"signInInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"signInInput"},"value":{"kind":"Variable","name":{"kind":"Name","value":"signInInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const SignInWithGoogleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignInWithGoogle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signInWithGoogle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<SignInWithGoogleMutation, SignInWithGoogleMutationVariables>;
export const RefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;