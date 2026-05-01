import showcase from '../../data/showcase'
import { SectionHeading } from '../SectionHeading'
import FeatureCardMobile from './FeatureCardMobile'

export default function SelectedWorkMobile() {
  return (
    <section
      id="selected-work"
      className="section relative px-5 py-20 flex flex-col gap-6"
      aria-labelledby="selected-work-heading-mobile"
    >
      <SectionHeading
        align="left"
        eyebrow="06 — selected work"
        title="Featured"
        subtitle="Four projects I'd put in front of anyone."
        id="selected-work-heading-mobile"
      />

      <div className="flex flex-col gap-5">
        {showcase.map((item, i) => (
          <FeatureCardMobile key={item.slug} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
