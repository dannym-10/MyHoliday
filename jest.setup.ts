jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const { View } = require("react-native");
  const AnimatedView = ({ children, style }: any) =>
    React.createElement(View, { style }, children);

  return {
    __esModule: true,
    default: {
      View: AnimatedView,
      createAnimatedComponent: (comp: any) => comp,
    },
    View: AnimatedView,
    useSharedValue: (val: any) => ({ value: val }),
    useAnimatedStyle: (fn: any) => fn(),
    withTiming: (val: any) => val,
    withRepeat: (val: any) => val,
    FadeIn: {},
    FadeOut: {},
    LinearTransition: {},
  };
});

jest.mock("react-native-worklets", () => ({}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@/assets/SVGs/ChevronRight", () => ({
  ChevronRight: () => null,
}));

jest.mock("@/assets/SVGs/EditIcon", () => ({
  EditIcon: () => null,
}));
