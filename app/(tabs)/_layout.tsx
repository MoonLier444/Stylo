import { Tabs } from 'expo-router'
import { View, StyleSheet } from 'react-native'
import { T } from '../../components/ui/Typography'
import { Colors } from '../../constants/theme'

function TabIcon({ focused, icon, label }: { focused: boolean; icon: string; label: string }) {
  return (
    <View style={styles.tabItem}>
      <T style={[styles.icon, focused && styles.iconActive]}>{icon}</T>
      <T variant="caption" color={focused ? Colors.black : Colors.gray400} weight={focused ? 'medium' : 'regular'}>
        {label}
      </T>
    </View>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="🏠" label="Home" />,
        }}
      />
      <Tabs.Screen
        name="wardrobe"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="👔" label="Armario" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="👤" label="Perfil" />,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    height: 80,
    paddingBottom: 16,
    paddingTop: 8,
  },
  tabItem: { alignItems: 'center', gap: 2 },
  icon: { fontSize: 22 },
  iconActive: { transform: [{ scale: 1.1 }] },
})
