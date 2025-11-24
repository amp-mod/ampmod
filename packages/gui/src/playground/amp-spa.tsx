import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import render from "./app-target";
import styles from "./amp-spa.css";
import lsNamespace from '../lib/amp-localstorage-namespace';
import Header from "../website/components/header/header";
import Footer from "../website/components/footer/footer";
import "./import-first";
import "../lib/themes/fonts/inter";
import { APP_NAME } from "@ampmod/branding";

const Interface = lazy(() => import(/* webpackChunkName: "interface" */ './render-interface'));
const Embed = lazy(() => import(/* webpackChunkName: "embed" */ './embed'));
const Home = lazy(() => import(/* webpackChunkName: "home" */ '../website/home/home'));
const Examples = lazy(() => import(/* webpackChunkName: "examples-landing" */ '../website/examples/examples'));

const NotFound: React.FC = () => {
    React.useEffect(() => {
        document.title = `Not Found - ${APP_NAME}`;
    }, []);

    return (
        <div className={styles.launching} data-theme={theme} style={{ "--loader-accent": accent } as any}>
            <h1>That page doesn't exist. :(</h1>
            <br />
            <div><Link to="/editor">Use {APP_NAME}</Link>, <Link to="/examples">check example projects</Link> or <Link to="/">go to the homepage</Link>.</div>
        </div>
    );
};


let accent = process.env.ampmod_mode === 'canary' ? '#FF4C4C' : '#4fa55c';
let theme = '';

const themeSetting = localStorage.getItem(`${lsNamespace}theme`);
try {
  const parsed = JSON.parse(themeSetting);
  theme = parsed.gui;
  if (parsed.accent) {
      const accentMap = {
        'purple': '#855cd6', 'blue': '#4c97ff', 'green': '#4fa55c', 'green-old': '#59c059', 
        'grey': '#333', 'red': '#FF4C4C', 'rainbow': '#4fa55c'
    };
    accent = accentMap[parsed.accent] || accent;
  }
} catch (e) { /* ignore */ }

if (!theme) {
  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

render(
  <Router basename={process.env.ROOT} future={{v7_startTransition: true}}>
    <Suspense fallback={<div className={styles.launching} data-theme={theme} style={{ "--loader-accent": accent } as any} />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/examples" element={<Examples />} />
        <Route path="/editor" element={<Interface />} />
        <Route path="/player" element={<Navigate to="/editor" replace />} />
        <Route path="/fullscreen" element={<Interface />} />
        <Route path="/embed" element={<Embed />} />

        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/examples.html" element={<Navigate to="/examples" replace />} />
        <Route path="/editor.html" element={<Navigate to="/editor" replace />} />
        <Route path="/player.html" element={<Navigate to="/editor" replace />} />
        <Route path="/fullscreen.html" element={<Navigate to="/fullscreen" replace />} />
        <Route path="/embed.html" element={<Navigate to="/embed" replace />} />
        <Route path="/" element={<Navigate to="/embed" replace />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </Router>
);