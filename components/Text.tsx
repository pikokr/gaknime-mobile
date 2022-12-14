import React from 'react'
import { Text, TextProps } from 'react-native'
import Animated, { AnimateProps } from 'react-native-reanimated'
import { useTheme } from '../utils'

export const StyledText: React.FC<TextProps & { weight?: string }> = ({
  style,
  weight,
  ...props
}) => {
  const theme = useTheme()

  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: `NotoSansKR-${weight ?? 'Regular'}`,
          color: theme.text,
          lineHeight: 24,
        },
        style,
      ]}
    />
  )
}

export const StyledAnimatedText: React.FC<
  AnimateProps<TextProps> & { weight?: string }
> = ({ style, weight, ...props }) => {
  const theme = useTheme()

  return (
    <Animated.Text
      {...props}
      style={[
        {
          fontFamily: `NotoSansKR-${weight ?? 'Regular'}`,
          color: theme.text,
          lineHeight: 24,
        },
        style,
      ]}
    />
  )
}
