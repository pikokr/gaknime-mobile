/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import RNRestart from 'react-native-restart'
import React, { useEffect, useRef } from 'react'

import {
  ActivityIndicator,
  BackHandler,
  useColorScheme,
  View,
  Animated,
} from 'react-native'
import axios from 'axios'
import { Banner, Gaknime } from './types'
import { StyledText } from './components/Text'
import { Button } from './components'
import { BannersContext, GaknimesContext, ThemeContext } from './utils'
import { RecoilRoot } from 'recoil'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Main from './views/Main'
import { SearchPage } from './views/Search'

const Stack = createNativeStackNavigator()

const App = () => {
  const isDark = useColorScheme() === 'dark'

  const [loading, setLoading] = React.useState(true)

  const [error, setError] = React.useState<Error | null>(null)

  const [gaknimes, setGaknimes] = React.useState<Gaknime[]>([])

  const [banners, setBanners] = React.useState<Banner[]>([])

  React.useEffect(() => {
    ;(async () => {
      const { data: fetchedGaknimes } = await axios.get<Gaknime[]>(
        'https://gakni.tech/gaknimes.json'
      )

      setGaknimes(fetchedGaknimes)

      const { data: fetchedBanners } = await axios.get<Banner[]>(
        'https://gakni.tech/banners.json'
      )

      setBanners(fetchedBanners)

      setLoading(false)
    })().catch((err) => {
      setError(err)
      setLoading(false)
    })
  }, [])

  const restartApp = React.useCallback(() => {
    RNRestart.Restart()
  }, [])

  const exitApp = React.useCallback(() => {
    BackHandler.exitApp()
  }, [])

  const theme = React.useMemo(() => {
    if (isDark) {
      // TODO
      return {
        text: '#fff',
        textInverted: '#000',
        footerBorder: 'rgba(255, 255, 255, 0.2)',
        primary: '#cccc00',
        inactiveFooterItem: 'rgba(255, 255, 255, 0.4)',
        background: '#222222',
        searchBackground: 'rgba(255, 255, 255, 0.1)',
      }
    }

    return {
      text: '#000',
      textInverted: '#fff',
      footerBorder: 'rgba(0, 0, 0, 0.2)',
      primary: '#cccc00',
      inactiveFooterItem: 'rgba(0, 0, 0, 0.4)',
      background: '#fff',
      searchBackground: 'rgba(0, 0, 0, 0.1)',
    }
  }, [isDark])

  const loadingOpacity = useRef(new Animated.Value(1)).current
  const contentOpacity = useRef(new Animated.Value(0)).current

  const [loadingDone, setLoadingDone] = React.useState(false)

  useEffect(() => {
    if (!loading) {
      Animated.timing(loadingOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }).start()

      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
        delay: 500,
      }).start()

      setTimeout(() => {
        setLoadingDone(true)
      }, 1000)
    }
  }, [contentOpacity, loading, loadingOpacity])

  return (
    <ThemeContext.Provider value={theme}>
      <Animated.View
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            display: loadingDone ? 'none' : 'flex',
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
          },
          { opacity: loadingOpacity },
        ]}
      >
        <StyledText weight="Black" style={{ fontSize: 36, lineHeight: 40 }}>
          GAKNIME
        </StyledText>
        <View style={{ marginTop: 12 }}>
          <ActivityIndicator size="large" color={theme.text} />
        </View>
      </Animated.View>

      <Animated.View
        style={{
          opacity: contentOpacity,
          height: '100%',
        }}
      >
        {loading ? null : error ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              flexDirection: 'column',
            }}
          >
            <StyledText style={{ fontSize: 24 }} weight="Bold">
              앗! 오류가 발생했어요!
            </StyledText>
            <StyledText style={{ fontSize: 16 }} weight="Light">
              {error.message}
            </StyledText>
            <View
              style={{ display: 'flex', flexDirection: 'row', marginTop: 12 }}
            >
              <Button onClick={restartApp}>
                <StyledText style={{ color: '#fff' }}>재시작하기</StyledText>
              </Button>
              <Button onClick={exitApp} style={{ marginLeft: 12 }}>
                <StyledText style={{ color: '#fff' }}>나가기</StyledText>
              </Button>
            </View>
          </View>
        ) : (
          <RecoilRoot>
            <GaknimesContext.Provider value={gaknimes}>
              <BannersContext.Provider value={banners}>
                <NavigationContainer
                  theme={{
                    dark: isDark,
                    colors: {
                      background: theme.background,
                      card: theme.background,
                      text: theme.text,
                      border: theme.footerBorder,
                      primary: theme.primary,
                      notification: theme.primary,
                    },
                  }}
                >
                  <Stack.Navigator
                    screenOptions={{
                      animation: 'slide_from_right',
                    }}
                  >
                    <Stack.Screen
                      options={{ headerShown: false }}
                      name="Home"
                      component={Main}
                    />
                    <Stack.Screen
                      options={{ headerShown: false }}
                      name="Search"
                      component={SearchPage}
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </BannersContext.Provider>
            </GaknimesContext.Provider>
          </RecoilRoot>
        )}
      </Animated.View>
    </ThemeContext.Provider>
  )
}

export default App
