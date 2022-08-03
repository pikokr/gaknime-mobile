import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useRecoilValue } from 'recoil'
import { Footer } from '../components'
import { currentTabAtom, MainTabType } from '../utils'
import { Home } from './Home'

const Main: React.FC = () => {
  const currentTab = useRecoilValue(currentTabAtom)

  return (
    <View style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ScrollView style={{ flexGrow: 1 }}>
        {currentTab === MainTabType.Main && <Home />}
      </ScrollView>
      <Footer />
    </View>
  )
}

export default Main