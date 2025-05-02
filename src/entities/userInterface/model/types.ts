import { Reducer } from '@reduxjs/toolkit';

import { UserInterfaceState } from './userInterface.slice';

export type UserInterfaceStore = ReturnType<Reducer<{ userInterface: UserInterfaceState }>>;
