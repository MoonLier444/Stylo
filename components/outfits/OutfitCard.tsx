import { View, StyleSheet } from 'react-native'
import { T } from '../ui/Typography'
import { Card } from '../ui/Card'
import { GarmentGrid } from './GarmentGrid'
import { FeedbackActions } from './FeedbackActions'
import { Colors, Spacing } from '../../constants/theme'
import { OUTFIT_TYPE_LABELS, OUTFIT_TYPE_ICONS } from '../../types/outfit'
import type { PopulatedOutfit, OutfitFeedbackReaction } from '../../types/outfit'

type Props = {
  outfit: PopulatedOutfit
  onFeedback: (outfitId: string, reaction: OutfitFeedbackReaction) => void
}

const TYPE_COLORS = {
  safe: Colors.safeLight,
  recommended: Colors.recommendedLight,
  exploration: Colors.explorationLight,
}

const TYPE_TEXT_COLORS = {
  safe: Colors.safe,
  recommended: Colors.recommended,
  exploration: Colors.exploration,
}

export function OutfitCard({ outfit, onFeedback }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[outfit.type] }]}>
          <T variant="caption" weight="semibold" color={TYPE_TEXT_COLORS[outfit.type]}>
            {OUTFIT_TYPE_ICONS[outfit.type]}  {OUTFIT_TYPE_LABELS[outfit.type]}
          </T>
        </View>
      </View>

      <View style={styles.garments}>
        <GarmentGrid garments={outfit.garments} />
      </View>

      {outfit.ai_reasoning && (
        <T variant="footnote" muted style={styles.reasoning} numberOfLines={3}>
          {outfit.ai_reasoning}
        </T>
      )}

      <FeedbackActions
        outfitId={outfit.id}
        currentReaction={outfit.userFeedback}
        onFeedback={onFeedback}
      />
    </Card>
  )
}

const styles = StyleSheet.create({
  card: { gap: Spacing[4] },
  header: { flexDirection: 'row', alignItems: 'center' },
  typeBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: 20,
  },
  garments: { marginHorizontal: -Spacing[1] },
  reasoning: { lineHeight: 18 },
})
