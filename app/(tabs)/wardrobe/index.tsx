import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { useGarments } from '../../../hooks/useGarments'
import { useWardrobeStore } from '../../../stores/wardrobeStore'
import { GarmentCard } from '../../../components/wardrobe/GarmentCard'
import { FilterBar } from '../../../components/wardrobe/FilterBar'
import { T } from '../../../components/ui/Typography'
import { Colors, Radius, Spacing } from '../../../constants/theme'
import type { Garment, GarmentCategory } from '../../../types/garment'

export default function WardrobeScreen() {
  const { garments, isLoading, isUploading, uploadGarment } = useGarments()
  const { searchQuery, activeCategory, setSearchQuery, setActiveCategory } = useWardrobeStore()

  async function handleAddGarment() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsMultipleSelection: false,
    })

    if (!result.canceled) {
      try {
        await uploadGarment(result.assets[0].uri)
      } catch {
        Alert.alert('Error', 'No se pudo analizar la prenda. Inténtalo de nuevo.')
      }
    }
  }

  function handleGarmentPress(garment: Garment) {
    router.push(`/(tabs)/wardrobe/${garment.id}`)
  }

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <T variant="title2" weight="semibold">
          Mi Armario
        </T>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleAddGarment}
          style={styles.addButton}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <T variant="headline" weight="semibold" color={Colors.white}>
              +
            </T>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.search}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Buscar prendas..."
          placeholderTextColor={Colors.gray400}
          returnKeyType="search"
        />
      </View>

      <FilterBar
        active={activeCategory}
        onSelect={(cat) => setActiveCategory(cat as GarmentCategory | 'all')}
      />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.black} />
        </View>
      ) : garments.length === 0 ? (
        <View style={styles.centered}>
          <T variant="title3" align="center">
            👗
          </T>
          <T variant="headline" weight="semibold" align="center" style={{ marginTop: Spacing[4] }}>
            Tu armario está vacío
          </T>
          <T variant="subhead" muted align="center" style={{ marginTop: Spacing[2] }}>
            Pulsa + para añadir tu primera prenda
          </T>
        </View>
      ) : (
        <FlatList
          data={garments}
          keyExtractor={(g) => g.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cell}>
              <GarmentCard garment={item} onPress={handleGarmentPress} />
            </View>
          )}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.offWhite },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[16],
    paddingBottom: Spacing[4],
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    paddingHorizontal: Spacing[5],
    marginBottom: Spacing[4],
  },
  searchInput: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    fontSize: 15,
    color: Colors.black,
  },
  list: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[10],
  },
  row: { gap: Spacing[3], marginBottom: Spacing[3] },
  cell: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
