declare module "ent-comp" {
  type EntityId = number;

  export interface ComponentState {
    __id: EntityId;
    [key: string]: any;
  }

  export interface ComponentDefinition<TState extends object = {}> {
    /** Unique component name */
    name: string;

    /** Default state */
    state?: TState;

    /** System execution order (default: 99) */
    order?: number;

    /** Whether an entity can have multiple instances */
    multi?: boolean;

    onAdd?(id: EntityId, state: TState & ComponentState): void;
    onRemove?(id: EntityId, state: TState & ComponentState): void;

    system?(
      dt: any,
      states: Array<TState & ComponentState>
    ): void;

    renderSystem?(
      dt: any,
      states: Array<TState & ComponentState>
    ): void;
  }

  export default class ECS {
    constructor();

    /** Component definitions */
    components: Record<string, ComponentDefinition>;
    comps: Record<string, ComponentDefinition>;

    createEntity(components?: string[]): EntityId;

    deleteEntity(id: EntityId): void;

    createComponent<TState extends object>(
      component: ComponentDefinition<TState>
    ): string;

    deleteComponent(name: string): void;

    addComponent<TState extends object>(
      id: EntityId,
      component: string,
      state?: Partial<TState>
    ): void;

    hasComponent(id: EntityId, component: string): boolean;

    removeComponent(id: EntityId, component: string): void;

    getState<TState extends object>(
      id: EntityId,
      component: string
    ): (TState & ComponentState) | Array<TState & ComponentState> | undefined;

    getStatesList<TState extends object>(
      component: string
    ): Array<TState & ComponentState>;

    getStateAccessor<TState extends object>(
      component: string
    ): (
      id: EntityId
    ) => (TState & ComponentState) | Array<TState & ComponentState> | undefined;

    getComponentAccessor(
      component: string
    ): (id: EntityId) => boolean;

    tick(dt?: any): void;

    render(dt?: any): void;

    removeMultiComponent(
      id: EntityId,
      component: string,
      index: number
    ): void;
  }
}