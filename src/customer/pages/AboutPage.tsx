/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { brandApi } from "../api";
import { useSectionData } from "../hooks/useSectionData";
import SectionHeader from "../components/SectionHeader";
import Btn from "../components/Btn";
import PageSeo from "../components/PageSeo";
import { LoadingScreen } from "../components/States";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  const { getSectionHeader, getButtonLabel } = useSectionData("page-about");
  const [designer, setDesigner] = useState<any[]>([]);
  const [about, setAbout] = useState<any[]>([]);
  const [ctaMsg, setCtaMsg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      brandApi.getDesignerProfile(),
      brandApi.getAboutBlocks(),
      brandApi.getMessageByKey("about_cta"),
    ]).then(([d, a, cta]) => {
      setDesigner(d as any[]);
      setAbout(a as any[]);
      setCtaMsg(cta);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  const get = (key: string) => designer.find((i) => i.key === key)?.value || "";

  return (
    <>
      <PageSeo route="/about" fallbackTitle="About | KEKAL" />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroImgWrap}>
          <img src={get("portrait")} alt={get("name")} className={styles.heroImg} />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroName}>{get("name")}</h1>
          <p className={styles.heroTitle}>{get("title")}</p>
        </div>
      </section>

      {/* Designer Story */}
      <section className={styles.designerSection}>
        <div className={styles.container}>
          <SectionHeader title={getSectionHeader("designer_story", "The Designer")} />
          <div className={styles.bioGrid}>
            <p className={styles.shortBio}>{get("short_bio")}</p>
            <p className={styles.fullBio}>{get("full_bio")}</p>
          </div>
        </div>
      </section>

      {/* Quote */}
      {get("quote") && (
        <section className={styles.quoteSection}>
          <div className={styles.container}>
            <blockquote className={styles.quote}>
              <p className={styles.quoteText}>"{get("quote")}"</p>
              <cite className={styles.quoteAuthor}>— {get("quote_author")}</cite>
            </blockquote>
          </div>
        </section>
      )}

      {/* About Content Blocks */}
      {about.map((block, i) => (
        <AboutBlock key={block.id} block={block} reverse={i % 2 !== 0} sectionHeader={getSectionHeader(block.key, block.title)} />
      ))}

      {/* Contact CTA */}
      {ctaMsg && (
        <section className={styles.cta}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>{ctaMsg.title}</h2>
            <p className={styles.ctaDesc}>{ctaMsg.description}</p>
            <Btn label={getButtonLabel("contact_cta", 0, "Contact")} to="/contact" variant="primary" />
          </div>
        </section>
      )}
    </>
  );
}

function AboutBlock({ block, reverse, sectionHeader }: { block: any; reverse: boolean; sectionHeader: string }) {
  const [activeImg, setActiveImg] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const images = block.images || [];

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(() => setActiveImg((p) => (p + 1) % images.length), 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [images.length]);

  return (
    <section className={`${styles.aboutBlock} ${reverse ? styles.aboutBlockReverse : ""}`}>
      <div className={styles.aboutBlockContainer}>
        {/* Image side */}
        <div className={styles.aboutImgSide}>
          {images.length > 0 && (
            <div className={styles.aboutImgWrap}>
              {images.map((src: string, i: number) => (
                <img
                  key={i}
                  src={src}
                  alt={block.title}
                  className={`${styles.aboutImg} ${i === activeImg ? styles.aboutImgActive : ""}`}
                />
              ))}
              {images.length > 1 && (
                <div className={styles.imgDots}>
                  {images.map((_: any, i: number) => (
                    <button key={i} className={`${styles.imgDot} ${i === activeImg ? styles.imgDotActive : ""}`} onClick={() => { setActiveImg(i); if (timerRef.current) clearInterval(timerRef.current); }} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Text side */}
        <div className={styles.aboutTextSide}>
          <SectionHeader title={sectionHeader} />
          <p className={styles.aboutContent}>{block.content}</p>
        </div>
      </div>
    </section>
  );
}
