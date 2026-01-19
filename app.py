import streamlit as st

st.set_page_config(page_title="Drug Repositioning Platform", layout="wide")

st.title("🧬 Drug Repositioning Knowledge Platform")
st.markdown(
    "A **research-oriented platform** for organizing drug repurposing evidence "
    "by **drug**, **target**, and **disease**."
)

section = st.sidebar.radio(
    "Browse by",
    ["Drug-Based", "Target-Based", "Disease-Based", "Latest Updates"]
)

if section == "Drug-Based":
    st.header("Drug-Based Repositioning")
    st.subheader("Metformin")
    st.write("**Original indication:** Type 2 Diabetes")
    st.write("**Repurposed indications:** Alzheimer’s disease, Cancer")
    st.write(
        "**Mechanism:** AMPK activation → reduced neuroinflammation → mTOR modulation"
    )
    st.write(
        "**Evidence:** Animal models, observational human studies"
    )

elif section == "Target-Based":
    st.header("Target-Based Repositioning")
    st.subheader("AMPK (AMP-activated protein kinase)")
    st.write("**Drugs acting on this target:** Metformin, AICAR")
    st.write(
        "**Diseases linked:** Alzheimer’s disease, Metabolic syndrome, Cancer"
    )
    st.write(
        "**Why it matters:** Central regulator of cellular energy and inflammation"
    )

elif section == "Disease-Based":
    st.header("Disease-Based Repositioning")
    st.subheader("Alzheimer’s Disease")
    st.write(
        "**Key dysregulated pathways:** Neuroinflammation, metabolic dysfunction"
    )
    st.write("**Repurposed drug candidates:**")
    st.markdown("- **Metformin** – AMPK-mediated neuroprotection")
    st.markdown("- **Sildenafil** – Improved cerebral blood flow")
    st.markdown("- **Minocycline** – Microglial inhibition")

elif section == "Latest Updates":
    st.header("Latest Drug Repositioning Updates")
    st.markdown(
        "- **2024** – Metformin shows neuroprotective effects in AD mouse models"
    )
    st.markdown(
        "- **2023** – Sildenafil associated with reduced Alzheimer’s incidence"
    )
    st.markdown(
        "- **2024** – Minocycline reduces neuroinflammation in preclinical studies"
    )
