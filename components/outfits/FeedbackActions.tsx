import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { T } from '../ui/Typography'
import { Colors, Radius, Spacing } from '../../constants/theme'
import type { OutfitFeedbackReaction } from '../../types/outfit'

type Props = {
  outfitId: string
  currentReaction?: OutfitFeedbackReaction | null
  onFeedback: (outfitId: string, reaction: OutfitFeedbackReaction) => void
}

type ActionButton = {
  reaction: OutfitFeedbackReaction
  icon: string
  label: string
  activeColor: string
}

const ACTIONS: ActionButton[] = [
  { reaction: 'liked', icon: '♡', label: 'Me gusta', activeColor: Colors.success },
  { reaction: 'disliked', icon: '✕', label: 'No', activeColor: Colors.error },
  { reaction: 'saved', icon: '💾', label: 'Guardar', activeColor: Colors.recommended },
]

export function FeedbackActions({ outfitId, currentReaction, onFeedback }: Props) {
  return (
    <View style={styles.container}>
      {ACTIONS.map((action) => {
        const isActive = currentReaction === action.reaction
        return (
          <TouchableOpacity
            key={action.reaction}
            activeOpacity={0.7}
            onPress={() => onFeedback(outfitId, action.reaction)}
            style={[styles.button, isActive && { borderColor: action.activeColor }]}
          >
            <T style={[styles.icon, isActive && { color: action.activeColor }]}>
              {action.icon}
            </T>
            <T
              variant="caption"
              weight={isActive ? 'semibold' : 'regular'}
              color={isActive ? action.activeColor : Colors.gray500}
            >
              {action.label}
            </T>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: Spacing[2] },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Spacing[2] + 2,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
  },
  icon: { fontSize: 16 },
})
