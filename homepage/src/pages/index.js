import React, { useState, useCallback, useEffect, useLayoutEffect } from "react"
import css from "./index.module.css"
import cn from "classnames"
import Layout from "../components/layout"
import FaqSubsection from "../components/HomeFaqSubsection"
import DownloadSection from "../components/HomeDownloadSection"
import SEO from "../components/seo"
import TARGET_BLANK from "../helpers/targetBlank"

const IndexPage = () => {
  const [openSections, setOpenSections] = useState({
    anki: true,
    how: true,
    immersion: true,
    beginner: true,
    content: true,
    speaking: true,
    featureRequest: true,
  })
  useEffect(
    () =>
      setOpenSections(o => {
        const result = {}
        for (const k in o) result[k] = window.location.hash === `#${k}`
        return result
      }),
    []
  )

  const [ankiFocused, setAnkiFocused] = useState(false)
  const focusAnki = useCallback(() => {
    setOpenSections(o => ({ ...o, anki: true }))
    setAnkiFocused(true)
    setTimeout(() => {
      setAnkiFocused(false)
    }, 3000)
  }, [])
  const [howFocused, setHowFocused] = useState(false)
  const focusHow = useCallback(() => {
    setOpenSections(o => ({ ...o, how: true }))
    setHowFocused(true)
    setTimeout(() => {
      setHowFocused(false)
    }, 3000)
  }, [])

  const [inputVideoIsOpen, setInputVideoIsOpen] = useState(false)
  const openInputVideo = useCallback(e => {
    e.preventDefault()
    setInputVideoIsOpen(true)
  }, [])

  return (
    <Layout>
      <SEO title="Learn languages for free through native media" />
      <section className={css.intro}>
        <h2 className={css.heading}>
          Learn a new language by enjoying <strong>native media</strong>.
        </h2>
        <p>
          Knowclip is a free desktop app that transforms your media into{" "}
          <strong>effective language-learning materials</strong>.
        </p>
      </section>

      <div className={css.middle}>
        <section className={css.steps}>
          <p>It makes it ridiculously easy to</p>
          <ol className={css.stepsList}>
            <li>grab sentences straight out of your video and audio files</li>
            <li>
              make <strong>media-rich</strong> flashcards tailored right to your
              level
            </li>
            <li>
              instantly bundle them into a ready-to-use{" "}
              <a href="#anki" onClick={focusAnki} className={css.link}>
                Anki deck
              </a>
              .
            </li>
          </ol>
        </section>
        <div className={css.demoVideo}>
          <div className={css.responsiveVideo}>
            <iframe
              title="demo-video"
              width="560"
              height="315"
              src="https://www.youtube-nocookie.com/embed/Duy8f4bOa-Y"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      </div>
      <section className={css.introBottom}>
        <p>
          Try it out and see what it's like to learn a language with tools{" "}
          <strong>
            <a href="#how" onClick={focusHow} className={css.link}>
              made for learning
            </a>
            , not for profit!
          </strong>
        </p>
      </section>

      <h2 className={css.downloadHeading} id="download">
        Download the app
      </h2>

      <DownloadSection />

      <hr className={css.hr} />

      <FaqSubsection
        className={cn({ [css.focused]: ankiFocused })}
        id="anki"
        heading="What's Anki?"
        isOpen={openSections.anki}
        setOpenSections={setOpenSections}
      >
        <>
          <p>
            <a
              href="https://apps.ankiweb.net"
              className={css.link}
              {...TARGET_BLANK}
            >
              Anki
            </a>{" "}
            is the gold standard in <i>spaced-repetition</i> flashcard software.
            It's a favorite of medical students, as well as pretty much everyone
            on the Internet who wants to{" "}
            <strong>remember a whole lot of stuff</strong>.
          </p>
          <p>
            It's available on{" "}
            <a
              href="https://apps.ankiweb.net/#dlarea"
              className={css.link}
              {...TARGET_BLANK}
            >
              Desktop, Android, IOS
            </a>
            , and even in your web browser, so you can learn at home or on the
            go.
          </p>
          <p>
            Once you've created your flashcard deck in Knowclip, it's 100% ready
            to use in Anki. But if you'd like to further customize your cards,
            you can do that using Anki itself.
          </p>
        </>
      </FaqSubsection>

      <FaqSubsection
        className={cn({ [css.focused]: howFocused })}
        id="how"
        heading="How does Knowclip help me learn?"
        isOpen={openSections.how}
        setOpenSections={setOpenSections}
      >
        <>
          <p>
            Everyone knows the best way to learn a language is to{" "}
            <strong>immerse yourself in it</strong>. Thanks to the Internet,
            it's now possible to do this without ever leaving your home—you can
            immerse yourself in a new language via TV series, movies, podcasts,
            and audiobooks!
          </p>

          <p>
            Knowclip is a way to make native media approachable as a
            language-learner. Its friendly interface lets you move through
            real-life dialog at your own pace. And crucially, it lets you{" "}
            <strong>
              concentrate on those bits you can learn to understand naturally
            </strong>{" "}
            at your current level.
          </p>

          <p>
            This is important because{" "}
            <strong>
              there's more to the immersion story than most people realize
            </strong>
            . Knowclip was designed to help you get{" "}
            <a href="#immersion" className={css.link}>
              the right kind of immersion
            </a>{" "}
            you need at this step in your journey towards fluency.
          </p>
        </>
      </FaqSubsection>

      <FaqSubsection
        id="immersion"
        heading="How can I learn from native media?"
        isOpen={openSections.immersion}
        setOpenSections={setOpenSections}
      >
        <>
          <p>
            When it comes to immersion in a new language, it's not enough just
            to maximize your exposure to native speech. In order to actually
            learn from that speech, it must be
          </p>
          <p>
            <ol>
              <li>
                <strong>within rich context</strong>, like the plot of a story
                or the thread of a conversation
              </li>
              <li>
                <strong>
                  <em>just</em> beyond your current level of understanding
                </strong>
                .
              </li>
            </ol>
          </p>
          <p>
            This way, your brain can <strong>fill in the gaps</strong> and make
            sense of new words or grammar structures almost automatically.
          </p>

          <p>
            This is the only way to{" "}
            <a
              href="https://youtu.be/J_EQDtpYSNM?t=230"
              className={css.link}
              onClick={openInputVideo}
              {...TARGET_BLANK}
            >
              truly acquire a language
            </a>
            , versus just learning <em>about</em> it, like you would in a
            classroom.{" "}
            {inputVideoIsOpen && (
              <div className={css.responsiveVideo}>
                <iframe
                  title="What I've Learned on language acquisition"
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/J_EQDtpYSNM?start=230&autoplay=1"
                  frameborder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;"
                  allowfullscreen
                ></iframe>
              </div>
            )}
            <strong>
              You don't need vocabulary lists or conjugation tables
            </strong>
            . You <em>definitely</em> don't need boring textbooks and silly
            classroom speaking exercises. What you need is{" "}
            <a
              href="http://www.antimoon.com/how/input.htm"
              className={css.link}
              {...TARGET_BLANK}
            >
              lots and lots of input
            </a>{" "}
            from engaging sources.
          </p>

          <p>
            Knowclip is here to <strong>keep your motivated</strong> while
            you're accumulating all those hours of input you'll need in order to
            become fluent. As a language-learner, there's a lot you won't
            understand, but Knowclip helps you{" "}
            <strong>
              focus on the bits you <em>can</em> understand
            </strong>
            . With the addition of{" "}
            <a href="#anki" className={css.link}>
              Anki
            </a>
            , you can be sure to remember what you learn and easily keep track
            of your progress.
          </p>
        </>
      </FaqSubsection>

      <FaqSubsection
        id="content"
        heading="Where can I find media to use with Knowclip?"
        isOpen={openSections.content}
        setOpenSections={setOpenSections}
      >
        <>
          <p>
            Since Knowclip works with pretty much any audio or video format, the
            possibilities are endless—where to look really depends on what
            language you're learning and what you're personally interested in. I
            plan to update this site with specific recommendations over the
            coming weeks. (
            <a
              href="https://twitter.com/@knowclip"
              className={css.link}
              {...TARGET_BLANK}
            >
              Follow @knowclip on Twitter
            </a>{" "}
            to stay updated.)
          </p>
          <p>
            What's most important is that you{" "}
            <strong>find something that holds your interest</strong>. Something
            like your favorite TV show is ideal—if you're familiar with the
            story, it can help you stay engaged and{" "}
            <a href="#immersion" className={css.link}>
              make sense of the language
            </a>
            .
          </p>
          <p>
            Of course, finding that content to download isn't always easy. I'm
            hoping to build a platform to make this easier, either as a web
            site, or as an integrated feature in Knowclip—please consider{" "}
            <a href="https://patreon.com/knowclip" className={css.link}>
              supporting me on Patreon
            </a>{" "}
            so I can make this happen while continuing to keep Knowclip free to
            download and use!
          </p>
          <p>
            <strong>If you're a content creator</strong>, I would love to
            collaborate with you to make your work more easily available for use
            with Knowclip, while making sure you're fairly compensated. If that
            sounds interesting to you, please feel free to{" "}
            <a href="mailto:knowclip@protonmail.com" className={css.link}>
              get in touch
            </a>
            !
          </p>
        </>
      </FaqSubsection>

      <FaqSubsection
        id="speaking"
        heading="Can it help with speaking?"
        isOpen={openSections.speaking}
        setOpenSections={setOpenSections}
      >
        <>
          <p>Knowclip has a handy <a className={css.link} href="https://www.youtube.com/watch?v=Duy8f4bOa-Y&feature=youtu.be&t=162">cloze-deletion (a.k.a. fill-in-the blanks) feature</a> than you can use to hone your speaking abilities to a certain extent, 
            {' '}and you always have the option to practice shadowing (a.k.a. repeating after the recording) as you're making flashcards in Knowclip and reviewing them in Anki.
            But when it comes down to it, the only way to get good at speaking a language with real humans is
            to
          </p>
          <p>
            <ol>
              <li>Learn to understand the language</li>
              <li>Practice speaking with real humans</li>
            </ol>
          </p>
          <p>
            Software can't replace #2, at least not yet{" "}
            <span role="img" aria-label="smile">
              😉️
            </span>{" "}
            But immersing yourself in native media (with the help of Knowclip)
            is{" "}
            <a href="#how" className={css.link}>
              a great way to learn to understand the language
            </a>
            . 
          </p>
          <p>
            Also keep in mind that{" "}
            <strong>
              #1 <em>must</em> happen before #2
            </strong>
            —you can't have a conversation with someone unless you can
            understand what they're saying! There are even people who advocate
            for a{" "}
            <a
              href="https://youtu.be/yW8M4Js4UBA?t=192"
              className={css.link}
              {...TARGET_BLANK}
            >
              silent period
            </a>{" "}
            when starting a new language.
          </p>
        </>
      </FaqSubsection>

      <FaqSubsection
        id="featureRequest"
        heading="I have an idea for a new feature!"
        isOpen={openSections.featureRequest}
        setOpenSections={setOpenSections}
      >
        <p>
          Though Knowclip is just something I've been building in my free time,
          I've got big plans for the future. Some features I already have in
          mind include:
        </p>

        <p>
          <ul>
            <li>in-app popup dictionaries</li>
            <li>speech-to-text integration</li>
            <li>sentence difficulty ratings based on word frequency</li>
            <li>
              ...so much more! See all planned features on{" "}
              <a
                href="https://github.com/knowclip/knowclip/projects/3"
                className={css.link}
                {...TARGET_BLANK}
              >
                Github
              </a>
              .
            </li>
          </ul>
        </p>

        <p>
          If you don't see your idea already in the{" "}
          <a
            href="https://github.com/knowclip/knowclip/projects/3"
            className={css.link}
            {...TARGET_BLANK}
          >
            list of planned features
          </a>
          , go ahead and tweet{" "}
          <a
            href="https://twitter.com/@knowclip"
            className={css.link}
            {...TARGET_BLANK}
          >
            @knowclip
          </a>{" "}
          or open an issue on Github.
        </p>

        <p>
          Please consider{" "}
          <a href="https://patreon.com/knowclip" className={css.link}>
            supporting me on Patreon
          </a>
          . You'll be directly enabling me to roll out new features and bugfixes
          on a regular basis, and you'll be helping me follow my dream of{" "}
          <strong>making quality language education free for everyone</strong>!
        </p>
      </FaqSubsection>

      <br />
    </Layout>
  )
}

export default IndexPage
