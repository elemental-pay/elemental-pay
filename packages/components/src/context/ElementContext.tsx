import React, { createContext } from 'react';

enum ActionTypes {
  ADD_REPLY = 'ADD_REPLY',
};
type ReplyValue = any;

type Action = {
  type: ActionTypes.ADD_REPLY,
  payload: ReplyValue,
};
type Dispatch = (action: Action) => void;
type State = { [key: string]: { [key: string]: ReplyValue } };
type ElementsProviderProps = { children: React.ReactNode };

const ElementsContext = createContext<
  {
    state: State;
    dispatch: Dispatch;
  } | undefined
>(undefined);

function elementsReducer(state: State, action: Action) {
  // const { type: actionType, payload } = action;

  switch (action.type) {
    case 'ADD_REPLY': {
      const { payload } = action;
      const { reply_to_post, id } = payload;

      if (!reply_to_post) {
        throw new Error('Reply to post ID missing');
      }

      return {
        ...state,
        [reply_to_post]: {
          ...state[reply_to_post],
          [id]: {
            ...payload,
          }
        },
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function ElementsProvider({ children }: ElementsProviderProps) {
  const [state, dispatch] = React.useReducer(elementsReducer, {});

  const value = { state, dispatch };
  return (
    <ElementsContext.Provider value={value}>
      {children}
    </ElementsContext.Provider>
  );
}


