import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { FlatList, TextInput, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { GaknimeCard, StyledText } from '../components'
import { Gaknime } from '../types'
import { useGaknimes, useTheme } from '../utils'

export const SearchPage: React.FC = () => {
  const theme = useTheme()

  const navigation = useNavigation()

  const [keyword, setKeyword] = React.useState('')

  const [resultKeyword, setResultKeyword] = React.useState('')

  const throttle = React.useRef<number | null>(null)

  const [results, setResults] = React.useState<Gaknime[]>([])

  const gaknimes = useGaknimes()

  const search = React.useCallback(() => {
    setResultKeyword(keyword)

    setResults(
      gaknimes.filter(
        (x) => x.title.includes(keyword) || x.description.includes(keyword)
      )
    )
  }, [gaknimes, keyword])

  React.useEffect(() => {
    search()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View style={{ height: '100%' }}>
      <View
        style={{
          flexDirection: 'row',
          height: 48,
          paddingLeft: 16,
          paddingRight: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.footerBorder,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={{ marginRight: 12 }}
          onPress={navigation.goBack}
        >
          <Icon name="chevron-left" color={theme.text} size={16} />
        </TouchableOpacity>
        <View
          style={{
            flexGrow: 1,
            flexDirection: 'row',
            width: 0,
            backgroundColor: theme.searchBackground,
            alignItems: 'center',
            paddingLeft: 8,
            paddingRight: 8,
            borderRadius: 6,
            height: 32,
          }}
        >
          <Icon color={theme.text} name="search" size={16} />
          <View
            style={{
              flexGrow: 1,
              width: 0,
              overflow: 'hidden',
              paddingVertical: 4,
            }}
          >
            <TextInput
              style={{
                width: '100%',
                fontFamily: 'NotoSansKR-Regular',
                padding: 0,
                margin: 0,
                paddingLeft: 8,
                height: 18,
              }}
              placeholder="제목, 설명으로 검색"
              autoFocus
              onTextInput={(e) => {
                setKeyword(e.nativeEvent.text)
                if (throttle.current) {
                  clearTimeout(throttle.current)
                }

                throttle.current = setTimeout(search, 200)
              }}
            />
          </View>
        </View>
      </View>
      <FlatList
        numColumns={2}
        style={{ margin: 16 }}
        ListHeaderComponent={
          <>
            <StyledText style={{ fontSize: 18 }}>
              <StyledText weight="Bold">'{resultKeyword}'</StyledText> 검색 결과
            </StyledText>
            <StyledText style={{ fontSize: 12 }}>
              검색 결과 <StyledText weight="Bold">{results.length}</StyledText>
              개
            </StyledText>
          </>
        }
        data={results}
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: 1 / 2,
              marginRight: index % 2 === 0 ? 16 : 0,
              marginTop: 16,
            }}
          >
            <GaknimeCard
              style={{
                width: '100%',
              }}
              gaknime={item}
            />
          </View>
        )}
      />
    </View>
  )
}
