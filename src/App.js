import { useState, useEffect } from "react";
import { saveUserData, loadUserData, getAllUsers, deleteUserData } from './dataService';
import { isSupabaseConfigured } from './supabaseClient';

const DIMENSIONS = [
  {
    id: "strategy",
    label: "Stratégie Digitale",
    icon: "◆",
    color: "#E85D3A",
    description: "Comment le digital s'intègre dans la stratégie globale de l'entreprise",
    subDimensions: [
      {
        id: "vision",
        label: "Vision & ambition digitale",
        question: "L'entreprise dispose-t-elle d'une vision digitale claire, partagée et alignée avec sa stratégie business ?",
        levels: [
          "Aucune vision digitale formalisée",
          "Vision émergente portée par quelques individus",
          "Vision documentée mais peu diffusée",
          "Vision partagée et intégrée à la stratégie business",
          "Vision digitale moteur de la stratégie, revue régulièrement"
        ]
      },
      {
        id: "roadmap",
        label: "Feuille de route & investissements",
        question: "Existe-t-il une roadmap digitale budgétée avec des KPIs de suivi ?",
        levels: [
          "Pas de roadmap ni budget dédié",
          "Initiatives ponctuelles sans cohérence globale",
          "Roadmap partielle avec budget limité",
          "Roadmap complète, budgétée, avec KPIs",
          "Roadmap agile, arbitrages data-driven, ROI mesuré"
        ]
      },
      {
        id: "ecosystem",
        label: "Écosystème & partenariats",
        question: "L'entreprise s'appuie-t-elle sur un écosystème de partenaires technologiques structuré ?",
        levels: [
          "Aucun partenariat technologique",
          "Quelques prestataires ponctuels",
          "Panel de partenaires identifiés",
          "Écosystème structuré avec partenariats stratégiques",
          "Co-innovation avec partenaires, participation à des labs/incubateurs"
        ]
      },
      {
        id: "innovation",
        label: "Capacité d'innovation",
        question: "L'entreprise dispose-t-elle de mécanismes structurés pour innover (veille, POC, labs) ?",
        levels: [
          "Aucun mécanisme d'innovation",
          "Veille technologique informelle",
          "Processus de veille et POC occasionnels",
          "Lab innovation, budget dédié, pipeline de POC",
          "Culture d'innovation systémique, intrapreneuriat, open innovation"
        ]
      },
      {
        id: "bizmodel",
        label: "Modèle économique digital",
        question: "L'entreprise a-t-elle fait évoluer son business model grâce au digital (nouveaux revenus, plateforme, servitisation) ?",
        levels: [
          "Business model inchangé, aucune composante digitale",
          "Digitalisation marginale de l'offre existante",
          "Nouvelles offres digitales complémentaires identifiées",
          "Revenus digitaux significatifs, modèle hybride en place",
          "Business model digital-first, plateforme ou écosystème de valeur"
        ]
      },
      {
        id: "benchmark",
        label: "Veille concurrentielle digitale",
        question: "L'entreprise monitore-t-elle activement le positionnement digital de ses concurrents et du marché ?",
        levels: [
          "Aucune veille concurrentielle digitale",
          "Veille informelle et occasionnelle",
          "Veille structurée sur les principaux concurrents",
          "Benchmark digital régulier avec indicateurs comparatifs",
          "Intelligence concurrentielle digitale intégrée à la stratégie, outils dédiés"
        ]
      }
    ]
  },
  {
    id: "customer",
    label: "Expérience Client",
    icon: "●",
    color: "#2D9CDB",
    description: "Capacité à offrir une expérience client digitale fluide et personnalisée",
    subDimensions: [
      {
        id: "omnichannel",
        label: "Parcours omnicanal",
        question: "Les parcours clients sont-ils fluides et cohérents sur l'ensemble des canaux (web, mobile, téléphone, agence) ?",
        levels: [
          "Canaux isolés, pas de cohérence",
          "Quelques canaux digitaux sans intégration",
          "Parcours multi-canal avec cohérence partielle",
          "Expérience omnicanale intégrée",
          "Parcours hyperpersonnalisé, prédictif, temps réel"
        ]
      },
      {
        id: "selfservice",
        label: "Self-service & autonomie client",
        question: "Les clients peuvent-ils réaliser leurs démarches en toute autonomie via des outils digitaux ?",
        levels: [
          "Aucun self-service disponible",
          "Informations basiques en ligne",
          "Quelques démarches digitalisées",
          "Majorité des démarches en self-service",
          "Self-service intelligent avec assistance IA contextuelle"
        ]
      },
      {
        id: "personalization",
        label: "Personnalisation",
        question: "L'entreprise personnalise-t-elle ses interactions en fonction du profil et du comportement client ?",
        levels: [
          "Aucune personnalisation",
          "Segmentation basique (profil démographique)",
          "Personnalisation par segments comportementaux",
          "Personnalisation individuelle basée sur les données",
          "Hyperpersonnalisation temps réel alimentée par l'IA"
        ]
      },
      {
        id: "feedback",
        label: "Écoute & satisfaction client",
        question: "L'entreprise mesure-t-elle et exploite-t-elle systématiquement le feedback client ?",
        levels: [
          "Aucune mesure de satisfaction",
          "Enquêtes ponctuelles",
          "NPS/CSAT mesuré régulièrement",
          "Feedback intégré dans les processus d'amélioration",
          "Voice of Customer temps réel, closed-loop systématique"
        ]
      },
      {
        id: "engagement",
        label: "Engagement digital & communautés",
        question: "L'entreprise anime-t-elle des communautés clients, réseaux sociaux, content marketing pour renforcer l'engagement ?",
        levels: [
          "Aucune présence digitale active (réseaux, communautés)",
          "Présence basique sur les réseaux sociaux, peu d'interaction",
          "Stratégie social media définie, contenus réguliers",
          "Communautés clients actives, engagement mesuré, advocacy",
          "Écosystème communautaire intégré, co-création avec les clients, UGC"
        ]
      },
      {
        id: "accessibility",
        label: "Accessibilité & inclusion numérique",
        question: "Les interfaces digitales sont-elles accessibles à tous les publics (RGAA, WCAG, inclusion) ?",
        levels: [
          "Aucune prise en compte de l'accessibilité",
          "Sensibilisation mais pas de démarche structurée",
          "Audit d'accessibilité réalisé, corrections partielles",
          "Conformité RGAA/WCAG sur les principaux parcours, tests réguliers",
          "Accessibilité native intégrée au design system, inclusion totale, certification"
        ]
      }
    ]
  },
  {
    id: "technology",
    label: "Technologie",
    icon: "⬡",
    color: "#27AE60",
    description: "Infrastructure technique et capacité à créer, stocker et échanger les données",
    subDimensions: [
      {
        id: "infrastructure",
        label: "Infrastructure & cloud",
        question: "Quel est le niveau de modernisation de l'infrastructure IT (cloud, scalabilité, résilience) ?",
        levels: [
          "Infrastructure vieillissante, on-premise uniquement",
          "Migration cloud partielle, quelques services SaaS",
          "Stratégie cloud définie, hybride en place",
          "Cloud-first, infrastructure as code, scalabilité",
          "Cloud-native, serverless, auto-scaling, multi-cloud"
        ]
      },
      {
        id: "integration",
        label: "Intégration & APIs",
        question: "Les systèmes sont-ils interconnectés via des APIs et des plateformes d'intégration ?",
        levels: [
          "Systèmes en silos, aucune API",
          "Intégrations point-à-point ponctuelles",
          "Quelques APIs, bus d'intégration partiel",
          "Plateforme API management, catalogue d'APIs",
          "Architecture API-first, marketplace d'APIs, event-driven"
        ]
      },
      {
        id: "security",
        label: "Cybersécurité & conformité",
        question: "L'entreprise a-t-elle une posture de cybersécurité mature (RGPD, SOC, pentest, SIEM) ?",
        levels: [
          "Sécurité minimale, pas de politique formalisée",
          "Antivirus/firewall basiques, conformité RGPD partielle",
          "Politique de sécurité documentée, audits occasionnels",
          "SOC, SIEM, pentests réguliers, conformité complète",
          "Zero Trust, DevSecOps, threat intelligence, certification ISO 27001"
        ]
      },
      {
        id: "architecture",
        label: "Architecture applicative",
        question: "L'architecture applicative est-elle modulaire, moderne et évolutive ?",
        levels: [
          "Applications monolithiques, legacy dominant",
          "Quelques applications modernes isolées",
          "Mix monolithe/microservices, modernisation en cours",
          "Architecture microservices, containerisation",
          "Architecture composable, headless, event-driven, domain-driven"
        ]
      },
      {
        id: "observability",
        label: "Observabilité & résilience",
        question: "L'entreprise dispose-t-elle de capacités de monitoring, alerting et de plans de continuité/reprise (PCA/PRA) testés ?",
        levels: [
          "Pas de monitoring, pas de PCA/PRA formalisé",
          "Monitoring basique, PCA/PRA documenté mais non testé",
          "Outils de monitoring en place, PCA/PRA testé annuellement",
          "Observabilité avancée (APM, logs centralisés, alerting), PCA/PRA testé régulièrement",
          "Observabilité full-stack, chaos engineering, auto-healing, RTO/RPO optimisés"
        ]
      },
      {
        id: "greenit",
        label: "Green IT & sobriété numérique",
        question: "L'empreinte environnementale du SI est-elle mesurée et activement réduite ?",
        levels: [
          "Aucune prise en compte de l'impact environnemental du SI",
          "Sensibilisation émergente, pas de mesure concrète",
          "Premiers indicateurs d'empreinte carbone SI, actions ponctuelles",
          "Stratégie Green IT formalisée, éco-conception, indicateurs suivis",
          "Numérique responsable intégré (INR), sobriété by design, label NR"
        ]
      }
    ]
  },
  {
    id: "operations",
    label: "Opérations",
    icon: "▲",
    color: "#F2994A",
    description: "Digitalisation et optimisation des processus métier internes",
    subDimensions: [
      {
        id: "processes",
        label: "Digitalisation des processus",
        question: "Quel pourcentage des processus métier clés est digitalisé et automatisé ?",
        levels: [
          "Processus majoritairement manuels/papier",
          "Quelques processus digitalisés (<25%)",
          "Processus principaux digitalisés (25-50%)",
          "Majorité des processus digitalisés (50-75%)",
          "Processus digitalisés et optimisés en continu (>75%)"
        ]
      },
      {
        id: "automation",
        label: "Automatisation & RPA/IA",
        question: "L'entreprise utilise-t-elle des technologies d'automatisation (RPA, workflows, IA) ?",
        levels: [
          "Aucune automatisation",
          "Macros et scripts ponctuels",
          "Workflows automatisés sur quelques processus",
          "RPA déployé, IA sur des cas d'usage ciblés",
          "Hyperautomation, IA décisionnelle intégrée aux processus"
        ]
      },
      {
        id: "agility",
        label: "Agilité opérationnelle",
        question: "L'organisation est-elle capable de s'adapter rapidement aux changements (méthodes agiles, DevOps) ?",
        levels: [
          "Organisation en cascade, cycles longs",
          "Quelques équipes en agile, reste en waterfall",
          "Agile adopté sur les projets digitaux",
          "Agile à l'échelle (SAFe, Spotify), DevOps en place",
          "Organisation produit, continuous delivery, feature teams autonomes"
        ]
      },
      {
        id: "supply",
        label: "Chaîne de valeur digitale",
        question: "La chaîne de valeur (fournisseurs, partenaires, distribution) est-elle digitalisée de bout en bout ?",
        levels: [
          "Échanges manuels avec les partenaires",
          "Quelques échanges dématérialisés (email, EDI basique)",
          "Portails partenaires, EDI structuré",
          "Plateforme collaborative, flux automatisés",
          "Écosystème digital intégré, temps réel, prédictif"
        ]
      },
      {
        id: "knowledge",
        label: "Gestion des connaissances",
        question: "L'entreprise capitalise-t-elle sur ses savoirs via des outils digitaux (wiki, bases de connaissances, documentation) ?",
        levels: [
          "Connaissances non documentées, dépendance aux individus",
          "Documentation partielle sur des supports dispersés",
          "Base de connaissances centralisée, contribution occasionnelle",
          "Knowledge management structuré, wiki actif, recherche intelligente",
          "IA-augmented knowledge, capitalisation automatique, communautés de pratique"
        ]
      },
      {
        id: "perfkpis",
        label: "KPIs de performance digitale",
        question: "Existe-t-il des indicateurs opérationnels digitaux suivis (taux de digitalisation, SLA, taux d'automatisation) ?",
        levels: [
          "Aucun KPI de performance digitale",
          "Quelques métriques techniques suivies (disponibilité)",
          "Tableau de bord IT avec SLA et indicateurs de base",
          "KPIs digitaux métier et IT alignés, revus régulièrement",
          "Pilotage data-driven temps réel, OKRs digitaux, value stream metrics"
        ]
      }
    ]
  },
  {
    id: "culture",
    label: "Organisation & Culture",
    icon: "★",
    color: "#9B51E0",
    description: "Culture digitale, compétences, gouvernance et conduite du changement",
    subDimensions: [
      {
        id: "leadership",
        label: "Leadership digital",
        question: "La direction porte-t-elle activement la transformation digitale (CDO, comité digital, sponsorship) ?",
        levels: [
          "Aucun sponsor digital au comité de direction",
          "Intérêt déclaré mais pas de rôle dédié",
          "CDO ou responsable digital nommé",
          "Comité digital actif, transformation pilotée au plus haut niveau",
          "Digital intégré dans tous les rôles de direction, culture top-down"
        ]
      },
      {
        id: "skills",
        label: "Compétences & talents",
        question: "L'entreprise développe-t-elle activement les compétences digitales de ses collaborateurs ?",
        levels: [
          "Pas de formation digitale",
          "Formations ponctuelles non structurées",
          "Plan de formation digital existant",
          "Académie digitale interne, parcours certifiants",
          "Learning organization, upskilling continu, digital natives recrutés"
        ]
      },
      {
        id: "change",
        label: "Conduite du changement",
        question: "L'entreprise a-t-elle une approche structurée de la conduite du changement pour ses projets digitaux ?",
        levels: [
          "Aucune démarche de change management",
          "Communication projet basique",
          "Accompagnement change sur les projets majeurs",
          "Méthodologie change structurée (ADKAR, Kotter...)",
          "Change management intégré à tous les projets, ambassadeurs internes"
        ]
      },
      {
        id: "governance",
        label: "Gouvernance digitale",
        question: "Existe-t-il une gouvernance claire du digital (comitologie, arbitrage, portfolio management) ?",
        levels: [
          "Pas de gouvernance digitale",
          "Gouvernance informelle, décisions ad hoc",
          "Comité projet IT, reporting basique",
          "Gouvernance structurée, portfolio management, OKRs",
          "Gouvernance adaptative, FinOps, value stream management"
        ]
      },
      {
        id: "workplace",
        label: "Digital workplace & modes de travail",
        question: "L'entreprise a-t-elle adopté les outils et pratiques de travail collaboratif digital (digital workplace, remote, asynchrone) ?",
        levels: [
          "Outils bureautiques basiques, pas de collaboration digitale",
          "Email et quelques outils collaboratifs (visio, chat) sans cadre",
          "Suite collaborative déployée, télétravail encadré",
          "Digital workplace intégré, pratiques asynchrones, espaces collaboratifs",
          "Workplace intelligent, IA intégrée aux outils, culture remote-first/async-first"
        ]
      },
      {
        id: "diversity",
        label: "Diversité & inclusion dans le digital",
        question: "Les équipes digitales reflètent-elles la diversité de l'organisation ? Les profils non-tech sont-ils impliqués dans la transformation ?",
        levels: [
          "Équipes digitales homogènes, pas de réflexion sur la diversité",
          "Sensibilisation émergente, quelques actions ponctuelles",
          "Objectifs de diversité dans le recrutement tech, profils hybrides valorisés",
          "Équipes pluridisciplinaires, inclusion active, parité mesurée",
          "Diversité cognitive et culturelle comme levier d'innovation, ambassadeurs inclusion"
        ]
      }
    ]
  },
  {
    id: "data",
    label: "Data & IA",
    icon: "◇",
    color: "#EB5757",
    description: "Capacité à exploiter les données comme actif stratégique",
    subDimensions: [
      {
        id: "datastrategy",
        label: "Stratégie data",
        question: "L'entreprise a-t-elle une stratégie data formalisée avec une gouvernance associée ?",
        levels: [
          "Pas de stratégie data",
          "Données collectées sans vision globale",
          "Stratégie data émergente, quelques quick wins",
          "Stratégie data formalisée, CDO, data governance",
          "Data-driven organization, data mesh/fabric, monétisation"
        ]
      },
      {
        id: "analytics",
        label: "Analytics & BI",
        question: "L'entreprise exploite-t-elle ses données pour la prise de décision (dashboards, BI, analytics) ?",
        levels: [
          "Reporting manuel sur tableurs",
          "Quelques dashboards statiques",
          "BI déployée, dashboards interactifs",
          "Analytics avancé, data viz, self-service BI",
          "Analytics prédictif/prescriptif, temps réel, democratisé"
        ]
      },
      {
        id: "ai",
        label: "Intelligence Artificielle",
        question: "L'entreprise déploie-t-elle des solutions d'IA en production (ML, NLP, GenAI) ?",
        levels: [
          "Aucune initiative IA",
          "Exploration/veille IA",
          "POCs IA en cours ou réalisés",
          "IA en production sur des cas d'usage ciblés",
          "IA à l'échelle, MLOps, GenAI intégrée aux processus"
        ]
      },
      {
        id: "dataquality",
        label: "Qualité & gouvernance des données",
        question: "Les données sont-elles fiables, documentées et gouvernées (référentiels, MDM, qualité) ?",
        levels: [
          "Données non fiables, pas de référentiel",
          "Quelques référentiels, qualité inégale",
          "MDM partiel, règles de qualité définies",
          "Data catalog, data lineage, qualité mesurée",
          "Data mesh, contrats de données, qualité automatisée"
        ]
      },
      {
        id: "aiethics",
        label: "Éthique IA & conformité AI Act",
        question: "L'entreprise dispose-t-elle d'un cadre éthique pour l'usage de l'IA et des données (biais, explicabilité, conformité réglementaire) ?",
        levels: [
          "Aucune réflexion sur l'éthique IA",
          "Sensibilisation émergente, pas de cadre formalisé",
          "Charte éthique IA rédigée, premiers audits de biais",
          "Comité éthique IA actif, processus d'évaluation des risques, conformité AI Act en cours",
          "IA responsable intégrée au cycle de vie, explicabilité systématique, certification AI Act"
        ]
      },
      {
        id: "dataliteracy",
        label: "Culture data & data literacy",
        question: "Les collaborateurs non-techniques sont-ils formés à la lecture et l'exploitation des données ?",
        levels: [
          "Aucune culture data, données réservées aux experts",
          "Quelques formations data ponctuelles",
          "Programme de data literacy lancé, self-service BI accessible",
          "Data literacy généralisée, data champions dans chaque métier",
          "Organisation data-literate, décisions data-driven à tous les niveaux"
        ]
      }
    ]
  }
];

const MATURITY_LEVELS = [
  { level: 1, label: "Initial", color: "#EB5757", description: "Ad hoc, non structuré" },
  { level: 2, label: "Émergent", color: "#F2994A", description: "Initiatives isolées" },
  { level: 3, label: "Défini", color: "#F2C94C", description: "Processus structurés" },
  { level: 4, label: "Géré", color: "#27AE60", description: "Optimisé et mesuré" },
  { level: 5, label: "Optimisé", color: "#2D9CDB", description: "Leader digital" }
];

// ========== COMPOSANTS VISUELS ==========
function RadarChart({ scores, dimensions }) {
  const svgWidth = 520;
  const svgHeight = 480;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const maxRadius = 150;
  const levels = 5;
  const labelRadius = maxRadius + 45;

  const getAngle = (index) => (Math.PI * 2 * index) / dimensions.length - Math.PI / 2;

  const getPoint = (index, value) => {
    const angle = getAngle(index);
    const radius = (value / levels) * maxRadius;
    return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
  };

  const gridPolygons = Array.from({ length: levels }, (_, i) => {
    const points = dimensions.map((_, j) => getPoint(j, i + 1));
    return points.map(p => `${p.x},${p.y}`).join(" ");
  });

  const dataPoints = dimensions.map((d, i) => getPoint(i, scores[d.id] || 0));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(" ");

  const getTextAnchor = (angle) => {
    const deg = ((angle + Math.PI / 2) * 180) / Math.PI;
    const norm = ((deg % 360) + 360) % 360;
    if (norm > 45 && norm < 135) return "start";
    if (norm > 225 && norm < 315) return "end";
    return "middle";
  };

  const getDy = (angle) => {
    const deg = ((angle + Math.PI / 2) * 180) / Math.PI;
    const norm = ((deg % 360) + 360) % 360;
    if (norm < 30 || norm > 330) return -10;
    if (norm > 150 && norm < 210) return 8;
    return 0;
  };

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: "100%", maxWidth: 560, display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E85D3A" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2D9CDB" stopOpacity="0.04" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {gridPolygons.map((poly, i) => (
        <polygon key={i} points={poly} fill="none" stroke="#d8dce3" strokeWidth={i === levels - 1 ? 1.5 : 0.7} strokeDasharray={i < levels - 1 ? "3,3" : "none"} />
      ))}

      {dimensions.map((_, i) => {
        const p = getPoint(i, levels);
        return <line key={i} x1={centerX} y1={centerY} x2={p.x} y2={p.y} stroke="#d8dce3" strokeWidth="0.7" />;
      })}

      {Array.from({ length: levels }, (_, i) => {
        const p = getPoint(0, i + 1);
        return (
          <text key={i} x={p.x + 6} y={p.y - 4} fill="#bbb" fontSize="9" fontFamily="'DM Mono', monospace">{i + 1}</text>
        );
      })}

      <polygon points={dataPolygon} fill="url(#radarGrad)" stroke="#E85D3A" strokeWidth="2.5" filter="url(#glow)" style={{ transition: "all 0.6s ease" }} />

      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill={dimensions[i].color} stroke="#fff" strokeWidth="2" style={{ transition: "all 0.5s ease" }} />
      ))}

      {dimensions.map((d, i) => {
        const angle = getAngle(i);
        const lx = centerX + labelRadius * Math.cos(angle);
        const ly = centerY + labelRadius * Math.sin(angle) + getDy(angle);
        const anchor = getTextAnchor(angle);
        const score = scores[d.id] || 0;

        return (
          <g key={i}>
            <text x={lx} y={ly} textAnchor={anchor} dominantBaseline="middle" fill={d.color} fontSize="12.5" fontWeight="700" fontFamily="'DM Sans', sans-serif">
              {d.icon} {d.label}
            </text>
            <text x={lx} y={ly + 16} textAnchor={anchor} dominantBaseline="middle" fill="#999" fontSize="10.5" fontFamily="'DM Mono', monospace" fontWeight="500">
              {score > 0 ? `${score.toFixed(1)} / 5` : "—"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function GaugeScore({ score, maxScore = 5, label }) {
  const pct = (score / maxScore) * 100;
  const getColor = () => {
    if (pct < 30) return "#EB5757";
    if (pct < 50) return "#F2994A";
    if (pct < 70) return "#F2C94C";
    if (pct < 85) return "#27AE60";
    return "#2D9CDB";
  };
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto" }}>
        <svg viewBox="0 0 120 120" style={{ width: 120, height: 120 }}>
          <circle cx="60" cy="60" r="52" fill="none" stroke="#eef0f3" strokeWidth="8" />
          <circle cx="60" cy="60" r="52" fill="none" stroke={getColor()} strokeWidth="8"
            strokeDasharray={`${pct * 3.267} ${326.7 - pct * 3.267}`}
            strokeDashoffset="81.675" strokeLinecap="round"
            style={{ transition: "all 0.8s ease" }} />
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: getColor(), fontFamily: "'DM Mono', monospace" }}>
            {score.toFixed(1)}
          </div>
          <div style={{ fontSize: 10, color: "#888", marginTop: -2 }}>/ {maxScore}</div>
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "#888", fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function ScoreBar({ value, max = 5, color, animate }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ height: 6, background: "#eef0f3", borderRadius: 3, overflow: "hidden", flex: 1 }}>
      <div style={{
        height: "100%", background: color, borderRadius: 3,
        width: animate ? `${pct}%` : "0%",
        transition: "width 0.8s cubic-bezier(.4,0,.2,1)"
      }} />
    </div>
  );
}

export default function DigitalMaturityAssessment() {
  const [currentView, setCurrentView] = useState("login");
  const [currentTrigram, setCurrentTrigram] = useState("");
  const [trigramInput, setTrigramInput] = useState("");
  const [currentDim, setCurrentDim] = useState(0);
  const [currentSub, setCurrentSub] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animateResults, setAnimateResults] = useState(false);
  const [hoveredLevel, setHoveredLevel] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const totalQuestions = DIMENSIONS.reduce((acc, d) => acc + d.subDimensions.length, 0);

  // Charger tous les utilisateurs
  useEffect(() => {
    if (currentView === "login" || showAdmin) {
      setLoadingUsers(true);
      getAllUsers().then(users => {
        setAllUsers(users);
        setLoadingUsers(false);
      }).catch(err => {
        console.error('Error loading users:', err);
        setLoadingUsers(false);
      });
    }
  }, [currentView, showAdmin]);

  // Auto-save à chaque changement de réponse
  useEffect(() => {
    if (currentTrigram && Object.keys(answers).length > 0) {
      saveUserData(currentTrigram, {
        answers,
        currentDim,
        currentSub,
        lastUpdate: new Date().toISOString(),
        completed: currentView === "results"
      });
    }
  }, [answers, currentDim, currentSub, currentTrigram, currentView]);

  const handleLogin = async () => {
    const trimmed = trigramInput.trim().toUpperCase();
    if (trimmed.length !== 3) {
      alert("Le trigramme doit contenir exactement 3 caractères");
      return;
    }

    setCurrentTrigram(trimmed);
    const userData = await loadUserData(trimmed);

    if (userData && userData.answers && Object.keys(userData.answers).length > 0) {
      // Utilisateur existant avec données
      const resumeAssessment = window.confirm(
        `Bienvenue ${trimmed} !\n\nVous avez une évaluation ${userData.completed ? 'terminée' : 'en cours'} (${Object.keys(userData.answers).length}/${totalQuestions} réponses).\n\nCliquez OK pour reprendre ou Annuler pour recommencer.`
      );

      if (resumeAssessment) {
        setAnswers(userData.answers);
        setCurrentDim(userData.currentDim || 0);
        setCurrentSub(userData.currentSub || 0);
        if (userData.completed) {
          setCurrentView("results");
          setTimeout(() => setAnimateResults(true), 100);
        } else {
          setCurrentView("assessment");
        }
      } else {
        setAnswers({});
        setCurrentDim(0);
        setCurrentSub(0);
        setCurrentView("intro");
      }
    } else {
      // Nouvel utilisateur
      setCurrentView("intro");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ? Vos réponses sont sauvegardées.")) {
      setCurrentTrigram("");
      setTrigramInput("");
      setAnswers({});
      setCurrentDim(0);
      setCurrentSub(0);
      setCurrentView("login");
      setShowAdmin(false);
    }
  };

  const currentDimension = DIMENSIONS[currentDim];
  const currentSubDimension = currentDimension?.subDimensions[currentSub];
  const questionKey = currentSubDimension ? `${currentDimension.id}.${currentSubDimension.id}` : null;

  const handleAnswer = (level) => {
    const newAnswers = { ...answers, [questionKey]: level };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentSub < currentDimension.subDimensions.length - 1) {
        setCurrentSub(currentSub + 1);
      } else if (currentDim < DIMENSIONS.length - 1) {
        setCurrentDim(currentDim + 1);
        setCurrentSub(0);
      } else {
        setCurrentView("results");
        setTimeout(() => setAnimateResults(true), 100);
      }
    }, 300);
  };

  const goBack = () => {
    if (currentSub > 0) {
      setCurrentSub(currentSub - 1);
    } else if (currentDim > 0) {
      setCurrentDim(currentDim - 1);
      setCurrentSub(DIMENSIONS[currentDim - 1].subDimensions.length - 1);
    }
  };

  const getDimensionScore = (dimId) => {
    const dim = DIMENSIONS.find(d => d.id === dimId);
    if (!dim) return 0;
    const scores = dim.subDimensions.map(s => answers[`${dimId}.${s.id}`] || 0);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  const getGlobalScore = () => {
    const scores = DIMENSIONS.map(d => getDimensionScore(d.id));
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  const dimensionScores = {};
  DIMENSIONS.forEach(d => { dimensionScores[d.id] = getDimensionScore(d.id); });

  const getMaturityLabel = (score) => {
    if (score < 1.5) return MATURITY_LEVELS[0];
    if (score < 2.5) return MATURITY_LEVELS[1];
    if (score < 3.5) return MATURITY_LEVELS[2];
    if (score < 4.5) return MATURITY_LEVELS[3];
    return MATURITY_LEVELS[4];
  };

  const getRecommendations = () => {
    const sorted = DIMENSIONS.map(d => ({ ...d, score: getDimensionScore(d.id) })).sort((a, b) => a.score - b.score);
    return sorted.slice(0, 3).map(d => {
      const weakSubs = d.subDimensions
        .map(s => ({ ...s, score: answers[`${d.id}.${s.id}`] || 0 }))
        .sort((a, b) => a.score - b.score)
        .slice(0, 3);
      return { dimension: d, weakSubs };
    });
  };

  const globalScore = getGlobalScore();
  const maturity = getMaturityLabel(globalScore);

  const containerStyle = {
    fontFamily: "'DM Sans', sans-serif",
    background: "#ffffff",
    color: "#1a1a2e",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden"
  };

  const cardStyle = {
    background: "#f8f9fb",
    border: "1px solid #e2e5ea",
    borderRadius: 16,
    padding: 24
  };

  // ========== VUE LOGIN ==========
  if (currentView === "login") {

    return (
      <div style={containerStyle}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

        {/* Badge Supabase */}
        <div style={{ position: "absolute", top: 16, right: 16 }}>
          <div style={{
            padding: "6px 12px",
            background: isSupabaseConfigured() ? "#27AE6010" : "#F2994A10",
            border: `1px solid ${isSupabaseConfigured() ? "#27AE60" : "#F2994A"}30`,
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "'DM Mono', monospace",
            color: isSupabaseConfigured() ? "#27AE60" : "#F2994A",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}>
            <span>{isSupabaseConfigured() ? "●" : "○"}</span>
            {isSupabaseConfigured() ? "Supabase actif" : "Mode local"}
          </div>
        </div>

        <div style={{ maxWidth: 520, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#E85D3A", fontFamily: "'DM Mono', monospace", marginBottom: 16 }}>
            Diagnostic de maturité digitale
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 800, lineHeight: 1.15, margin: "0 0 12px", color: "#1a1a2e" }}>
            Connexion
          </h1>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 40 }}>
            Saisissez votre trigramme pour commencer ou reprendre votre évaluation
          </p>

          <div style={{ ...cardStyle, marginBottom: 32 }}>
            <input
              type="text"
              value={trigramInput}
              onChange={(e) => setTrigramInput(e.target.value.toUpperCase().slice(0, 3))}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Votre trigramme (3 lettres)"
              maxLength="3"
              style={{
                width: "100%",
                padding: "16px",
                fontSize: 24,
                fontWeight: 700,
                fontFamily: "'DM Mono', monospace",
                textAlign: "center",
                textTransform: "uppercase",
                border: "2px solid #e2e5ea",
                borderRadius: 12,
                outline: "none",
                background: "#fff",
                color: "#1a1a2e",
                letterSpacing: 8,
                marginBottom: 16
              }}
              autoFocus
            />
            <button
              onClick={handleLogin}
              disabled={trigramInput.length !== 3}
              style={{
                width: "100%",
                background: trigramInput.length === 3 ? "linear-gradient(135deg, #E85D3A, #c0392b)" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "16px",
                fontSize: 15,
                fontWeight: 600,
                cursor: trigramInput.length === 3 ? "pointer" : "not-allowed",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: trigramInput.length === 3 ? "0 4px 24px rgba(232,93,58,0.3)" : "none",
                transition: "all 0.3s ease"
              }}
            >
              Commencer →
            </button>
          </div>

          {allUsers.length > 0 && (
            <div style={{ ...cardStyle, textAlign: "left" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>
                {allUsers.length} évaluation{allUsers.length > 1 ? "s" : ""} sauvegardée{allUsers.length > 1 ? "s" : ""}
              </div>
              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                {allUsers.slice(0, 5).map(user => {
                  const userGlobalScore = (() => {
                    const scores = DIMENSIONS.map(d => {
                      const dim = DIMENSIONS.find(dim => dim.id === d.id);
                      const subScores = dim.subDimensions.map(s => user.answers[`${d.id}.${s.id}`] || 0);
                      return subScores.reduce((a, b) => a + b, 0) / subScores.length;
                    });
                    return scores.reduce((a, b) => a + b, 0) / scores.length;
                  })();

                  return (
                    <div
                      key={user.trigram}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: "#fff",
                        border: "1px solid #e2e5ea",
                        marginBottom: 8,
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onClick={() => {
                        setTrigramInput(user.trigram);
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: user.completed ? "#27AE6010" : "#E85D3A10",
                          border: `1px solid ${user.completed ? "#27AE60" : "#E85D3A"}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: "'DM Mono', monospace",
                          color: user.completed ? "#27AE60" : "#E85D3A"
                        }}>
                          {user.trigram}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>
                            {user.completed ? "Évaluation terminée" : "En cours"}
                          </div>
                          <div style={{ fontSize: 11, color: "#999" }}>
                            {Object.keys(user.answers).length}/{totalQuestions} réponses · {new Date(user.lastUpdate).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </div>
                      {user.completed && (
                        <div style={{
                          fontSize: 16,
                          fontWeight: 700,
                          fontFamily: "'DM Mono', monospace",
                          color: "#E85D3A"
                        }}>
                          {userGlobalScore.toFixed(1)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {allUsers.length > 5 && (
                <div style={{ fontSize: 11, color: "#999", marginTop: 12, textAlign: "center" }}>
                  + {allUsers.length - 5} autre{allUsers.length - 5 > 1 ? "s" : ""} évaluation{allUsers.length - 5 > 1 ? "s" : ""}
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: 32 }}>
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              style={{
                background: "transparent",
                border: "1px solid #ddd",
                color: "#666",
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              {showAdmin ? "Masquer" : "Voir"} tous les résultats
            </button>
          </div>

          {showAdmin && allUsers.length > 0 && (
            <div style={{ ...cardStyle, marginTop: 24, textAlign: "left" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 16 }}>
                Tous les utilisateurs ({allUsers.length})
              </div>
              <div style={{ maxHeight: 400, overflowY: "auto" }}>
                {allUsers.map(user => {
                  const userGlobalScore = (() => {
                    const scores = DIMENSIONS.map(d => {
                      const dim = DIMENSIONS.find(dim => dim.id === d.id);
                      const subScores = dim.subDimensions.map(s => user.answers[`${d.id}.${s.id}`] || 0);
                      return subScores.reduce((a, b) => a + b, 0) / subScores.length;
                    });
                    return scores.reduce((a, b) => a + b, 0) / scores.length;
                  })();
                  const userMaturity = getMaturityLabel(userGlobalScore);

                  return (
                    <div
                      key={user.trigram}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px",
                        borderRadius: 10,
                        background: "#fff",
                        border: "1px solid #e2e5ea",
                        marginBottom: 8
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background: user.completed ? userMaturity.color + "10" : "#ccc",
                          border: `1px solid ${user.completed ? userMaturity.color : "#ccc"}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: "'DM Mono', monospace",
                          color: user.completed ? userMaturity.color : "#666"
                        }}>
                          {user.trigram}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>
                            {user.completed ? userMaturity.label : "En cours"}
                          </div>
                          <div style={{ fontSize: 11, color: "#999" }}>
                            {Object.keys(user.answers).length}/{totalQuestions} · {new Date(user.lastUpdate).toLocaleDateString("fr-FR")}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {user.completed && (
                          <div style={{
                            fontSize: 18,
                            fontWeight: 700,
                            fontFamily: "'DM Mono', monospace",
                            color: userMaturity.color
                          }}>
                            {userGlobalScore.toFixed(1)}
                          </div>
                        )}
                        <button
                          onClick={async () => {
                            if (window.confirm(`Supprimer l'évaluation de ${user.trigram} ?`)) {
                              await deleteUserData(user.trigram);
                              setShowAdmin(false);
                              setTimeout(() => setShowAdmin(true), 10);
                            }
                          }}
                          style={{
                            background: "transparent",
                            border: "1px solid #EB5757",
                            color: "#EB5757",
                            borderRadius: 6,
                            padding: "4px 10px",
                            fontSize: 11,
                            cursor: "pointer",
                            fontFamily: "'DM Sans', sans-serif"
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========== VUE INTRO ==========
  if (currentView === "intro") {
    return (
      <div style={containerStyle}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

        <div style={{ position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            padding: "8px 16px",
            background: "#E85D3A10",
            border: "1px solid #E85D3A30",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'DM Mono', monospace",
            color: "#E85D3A"
          }}>
            {currentTrigram}
          </div>
          <button onClick={handleLogout} style={{
            background: "transparent",
            border: "1px solid #ddd",
            color: "#666",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif"
          }}>
            Déconnexion
          </button>
        </div>

        <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#E85D3A", fontFamily: "'DM Mono', monospace", marginBottom: 16 }}>
            Diagnostic de maturité digitale
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 800, lineHeight: 1.15, margin: "0 0 12px", color: "#1a1a2e" }}>
            Évaluation de la maturité digitale
          </h1>
          <div style={{ height: 40 }} />

          <div style={{ ...cardStyle, textAlign: "left", marginBottom: 32 }}>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 20 }}>
              Cet outil évalue la maturité digitale de votre organisation selon <strong style={{ color: "#E85D3A" }}>6 dimensions</strong> et <strong style={{ color: "#E85D3A" }}>{totalQuestions} critères</strong>, inspirés des frameworks de référence du marché :
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {DIMENSIONS.map(d => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "#fff", border: "1px solid #e2e5ea" }}>
                  <span style={{ fontSize: 18, color: d.color }}>{d.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: d.color }}>{d.label}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{d.subDimensions.length} critères</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...cardStyle, textAlign: "left", marginBottom: 32, borderColor: "#E85D3A40" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#E85D3A", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>MÉTHODOLOGIE</div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.7 }}>
              Basé sur le <strong style={{ color: "#333" }}>Deloitte / TM Forum Digital Maturity Model</strong> (5+1 dimensions, 28 sous-dimensions), enrichi des apports du <strong style={{ color: "#333" }}>MIT / Capgemini Digital Maturity Framework</strong> (intensité digitale × intensité managériale) et du <strong style={{ color: "#333" }}>BCG Digital Acceleration Index</strong>. Complété par les référentiels <strong style={{ color: "#333" }}>Cigref / INR</strong> (Green IT), <strong style={{ color: "#333" }}>EU AI Act</strong> (éthique IA) et <strong style={{ color: "#333" }}>RGAA / WCAG</strong> (accessibilité). Évaluation sur 5 niveaux inspirés du CMMI.
            </div>
          </div>

          <button onClick={() => setCurrentView("assessment")} style={{
            background: "linear-gradient(135deg, #E85D3A, #c0392b)",
            color: "#fff", border: "none", borderRadius: 12, padding: "16px 48px",
            fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 4px 24px rgba(232,93,58,0.3)",
            transition: "all 0.3s ease"
          }}>
            Démarrer l'évaluation →
          </button>
          <div style={{ fontSize: 11, color: "#999", marginTop: 12 }}>~15 minutes · {totalQuestions} questions</div>
        </div>
      </div>
    );
  }

  // ========== VUE ASSESSMENT ==========
  if (currentView === "assessment") {
    const dimProgress = ((currentSub + (answers[questionKey] ? 1 : 0)) / currentDimension.subDimensions.length) * 100;
    let qIndex = 0;
    for (let i = 0; i < currentDim; i++) qIndex += DIMENSIONS[i].subDimensions.length;
    qIndex += currentSub + 1;

    return (
      <div style={containerStyle}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

        <div style={{ position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            padding: "8px 16px",
            background: "#E85D3A10",
            border: "1px solid #E85D3A30",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'DM Mono', monospace",
            color: "#E85D3A"
          }}>
            {currentTrigram}
          </div>
          <button onClick={handleLogout} style={{
            background: "transparent",
            border: "1px solid #ddd",
            color: "#666",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif"
          }}>
            Déconnexion
          </button>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {DIMENSIONS.map((d, i) => (
                <div key={d.id} style={{
                  width: 28, height: 4, borderRadius: 2,
                  background: i < currentDim ? d.color : i === currentDim ? `linear-gradient(90deg, ${d.color} ${dimProgress}%, #e2e5ea ${dimProgress}%)` : "#e2e5ea",
                  transition: "all 0.4s ease"
                }} />
              ))}
            </div>
            <span style={{ fontSize: 11, color: "#999", fontFamily: "'DM Mono', monospace" }}>
              {qIndex}/{totalQuestions}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, marginTop: 20 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, background: `${currentDimension.color}12`, border: `1px solid ${currentDimension.color}30`,
              color: currentDimension.color
            }}>
              {currentDimension.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: 2 }}>
                Dimension {currentDim + 1}/{DIMENSIONS.length}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: currentDimension.color }}>
                {currentDimension.label}
              </div>
            </div>
            {(currentDim > 0 || currentSub > 0) && (
              <button onClick={goBack} style={{
                marginLeft: "auto", background: "#fff", border: "1px solid #ddd",
                color: "#666", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
              }}>← Retour</button>
            )}
          </div>

          <div style={{ ...cardStyle, marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: currentDimension.color, fontWeight: 600, marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>
              {currentSubDimension.label}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a2e", lineHeight: 1.5, marginBottom: 24 }}>
              {currentSubDimension.question}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {currentSubDimension.levels.map((level, i) => {
                const isSelected = answers[questionKey] === i + 1;
                const isHovered = hoveredLevel === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i + 1)}
                    onMouseEnter={() => setHoveredLevel(i)}
                    onMouseLeave={() => setHoveredLevel(null)}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 12,
                      padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                      background: isSelected ? `${currentDimension.color}10` : isHovered ? "#f0f1f4" : "#fff",
                      border: `1px solid ${isSelected ? currentDimension.color + "60" : isHovered ? "#ccc" : "#e2e5ea"}`,
                      color: "#333", textAlign: "left", fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{
                      width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono', monospace",
                      background: isSelected ? currentDimension.color : "#eef0f3",
                      color: isSelected ? "#fff" : "#888",
                      transition: "all 0.2s ease"
                    }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, lineHeight: 1.5 }}>{level}</div>
                      <div style={{ fontSize: 10, color: "#999", marginTop: 2 }}>
                        {MATURITY_LEVELS[i].label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========== VUE RESULTS ==========
  if (currentView === "results") {
    const recommendations = getRecommendations();
    const mitQuadrant = (() => {
      const techScore = (getDimensionScore("technology") + getDimensionScore("data")) / 2;
      const mgmtScore = (getDimensionScore("culture") + getDimensionScore("strategy")) / 2;
      if (techScore >= 3 && mgmtScore >= 3) return { name: "Digirati", desc: "Maturité digitale élevée sur les deux axes", color: "#27AE60" };
      if (techScore >= 3 && mgmtScore < 3) return { name: "Fashionista", desc: "Fort investissement techno mais transformation managériale insuffisante", color: "#F2994A" };
      if (techScore < 3 && mgmtScore >= 3) return { name: "Conservative", desc: "Bonne maturité managériale mais retard technologique", color: "#2D9CDB" };
      return { name: "Beginner", desc: "Maturité faible sur les deux axes", color: "#EB5757" };
    })();

    return (
      <div style={containerStyle}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

        <div style={{ position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            padding: "8px 16px",
            background: "#E85D3A10",
            border: "1px solid #E85D3A30",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "'DM Mono', monospace",
            color: "#E85D3A"
          }}>
            {currentTrigram}
          </div>
          <button onClick={handleLogout} style={{
            background: "transparent",
            border: "1px solid #ddd",
            color: "#666",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif"
          }}>
            Déconnexion
          </button>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#E85D3A", fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>
              Résultats du diagnostic
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, margin: "0 0 4px", color: "#1a1a2e" }}>
              Diagnostic de maturité digitale
            </h1>
            <div style={{ fontSize: 13, color: "#666" }}>Évaluation complète · {totalQuestions} critères · {new Date().toLocaleDateString("fr-FR")}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
            <div style={{ ...cardStyle, textAlign: "center" }}>
              <GaugeScore score={animateResults ? globalScore : 0} label="Score global" />
            </div>
            <div style={{ ...cardStyle, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <div style={{ fontSize: 11, color: "#888", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>NIVEAU DE MATURITÉ</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: maturity.color, fontFamily: "'DM Mono', monospace" }}>
                {maturity.label}
              </div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>Niveau {maturity.level}/5</div>
              <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{maturity.description}</div>
            </div>
            <div style={{ ...cardStyle, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <div style={{ fontSize: 11, color: "#888", fontFamily: "'DM Mono', monospace", marginBottom: 8 }}>QUADRANT MIT/CAPGEMINI</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: mitQuadrant.color }}>
                {mitQuadrant.name}
              </div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 6, lineHeight: 1.4, maxWidth: 180 }}>{mitQuadrant.desc}</div>
            </div>
          </div>

          <div style={{ ...cardStyle, marginBottom: 32 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 16 }}>Vue radar des 6 dimensions</div>
            <RadarChart scores={animateResults ? dimensionScores : {}} dimensions={DIMENSIONS} />
          </div>

          <div style={{ ...cardStyle, marginBottom: 32 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 20 }}>Détail par dimension</div>
            {DIMENSIONS.map(d => {
              const score = getDimensionScore(d.id);
              const ml = getMaturityLabel(score);
              return (
                <div key={d.id} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid #e2e5ea" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: d.color, fontSize: 16 }}>{d.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: d.color }}>{d.label}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 12, color: ml.color, fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>{ml.label}</span>
                      <span style={{ fontSize: 18, fontWeight: 700, color: d.color, fontFamily: "'DM Mono', monospace" }}>{score.toFixed(1)}</span>
                    </div>
                  </div>
                  {d.subDimensions.map(s => {
                    const val = answers[`${d.id}.${s.id}`] || 0;
                    return (
                      <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, paddingLeft: 26 }}>
                        <span style={{ fontSize: 11, color: "#555", width: 220, flexShrink: 0 }}>{s.label}</span>
                        <ScoreBar value={animateResults ? val : 0} color={d.color} animate={animateResults} />
                        <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "#888", width: 20, textAlign: "right" }}>{val}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <div style={{ ...cardStyle, marginBottom: 32 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 4 }}>Matrice MIT / Capgemini</div>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 16 }}>Intensité digitale × Intensité de transformation managériale</div>
            <div style={{ position: "relative", width: 280, height: 280, margin: "0 auto" }}>
              <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 2 }}>
                {[
                  { name: "Conservative", color: "#2D9CDB", pos: "top-left" },
                  { name: "Digirati", color: "#27AE60", pos: "top-right" },
                  { name: "Beginner", color: "#EB5757", pos: "bottom-left" },
                  { name: "Fashionista", color: "#F2994A", pos: "bottom-right" }
                ].map(q => (
                  <div key={q.name} style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: mitQuadrant.name === q.name ? `${q.color}15` : "#fff",
                    border: mitQuadrant.name === q.name ? `2px solid ${q.color}` : "1px solid #e2e5ea",
                    borderRadius: 8, fontSize: 12, fontWeight: mitQuadrant.name === q.name ? 700 : 400,
                    color: mitQuadrant.name === q.name ? q.color : "#aaa"
                  }}>
                    {q.name}
                  </div>
                ))}
              </div>
              <div style={{ position: "absolute", left: -8, top: "50%", transform: "translateY(-50%) rotate(-90deg)", fontSize: 10, color: "#666", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>
                Intensité managériale →
              </div>
              <div style={{ position: "absolute", bottom: -20, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: "#666", fontFamily: "'DM Mono', monospace" }}>
                Intensité digitale →
              </div>
            </div>
          </div>

          <div style={{ ...cardStyle, marginBottom: 32, borderColor: "#E85D3A40" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#E85D3A", marginBottom: 4 }}>🎯 Axes d'amélioration prioritaires</div>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 20 }}>Les 3 dimensions les plus faibles et leurs critères à renforcer en priorité</div>
            {recommendations.map((rec, i) => (
              <div key={rec.dimension.id} style={{ marginBottom: 16, padding: 16, borderRadius: 12, background: "#fff", border: "1px solid #e2e5ea" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#E85D3A", fontFamily: "'DM Mono', monospace" }}>#{i + 1}</span>
                  <span style={{ color: rec.dimension.color, fontSize: 14 }}>{rec.dimension.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: rec.dimension.color }}>{rec.dimension.label}</span>
                  <span style={{ marginLeft: "auto", fontSize: 13, color: "#888", fontFamily: "'DM Mono', monospace" }}>{getDimensionScore(rec.dimension.id).toFixed(1)}/5</span>
                </div>
                {rec.weakSubs.map(s => (
                  <div key={s.id} style={{ fontSize: 12, color: "#666", paddingLeft: 32, marginBottom: 4 }}>
                    → <strong style={{ color: "#333" }}>{s.label}</strong> : niveau {s.score}/5 — cible recommandée : {Math.min(s.score + 2, 5)}/5
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => {
              if (window.confirm("Recommencer l'évaluation ? Vos résultats actuels seront remplacés.")) {
                setAnswers({});
                setCurrentDim(0);
                setCurrentSub(0);
                setAnimateResults(false);
                setCurrentView("intro");
              }
            }} style={{
              background: "#fff", border: "1px solid #ddd",
              color: "#666", borderRadius: 10, padding: "12px 24px", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
            }}>
              Recommencer
            </button>
            <button onClick={() => {
              setCurrentView("assessment");
              setCurrentDim(0);
              setCurrentSub(0);
              setAnimateResults(false);
            }} style={{
              background: "linear-gradient(135deg, #E85D3A, #c0392b)", border: "none",
              color: "#fff", borderRadius: 10, padding: "12px 24px", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 16px rgba(232,93,58,0.2)"
            }}>
              Modifier les réponses
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 40, padding: "20px 0", borderTop: "1px solid #e2e5ea" }}>
            <div style={{ fontSize: 10, color: "#bbb", fontFamily: "'DM Mono', monospace" }}>
              Méthodologie : Deloitte/TM Forum DMM · MIT/Capgemini · BCG DAI · Cigref/INR · EU AI Act · RGAA/WCAG · CMMI
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
