import matplotlib.pyplot as plt
import numpy as np
import os

# Set output directory
out_dir = r"c:\Users\Darsh\OneDrive\Desktop\SIH\PS2\CogniCare"
if not os.path.exists(out_dir):
    os.makedirs(out_dir)

# ==========================================
# CHART 1: Doughnut Chart (Treatment Gap)
# ==========================================
fig1, ax1 = plt.subplots(figsize=(6, 6))
fig1.patch.set_facecolor('white')

labels = ['Undiagnosed / Untreated\n(90%)', 'Diagnosed &\nManaged (10%)']
sizes = [90, 10]
colors = ['#EF4444', '#00C9A7'] # Red for untreated, Teal for treated
explode = (0.05, 0)

# Create doughnut chart
wedges, texts, autotexts = ax1.pie(
    sizes, 
    explode=explode, 
    labels=labels, 
    colors=colors, 
    autopct='%1.0f%%',
    shadow=False, 
    startangle=90,
    textprops={'fontsize': 14, 'weight': 'bold'}
)

# Draw circle in the center to make it a doughnut
centre_circle = plt.Circle((0,0), 0.65, fc='white')
fig1.gca().add_artist(centre_circle)

plt.title("The Rural Dementia Treatment Gap", fontsize=18, fontweight='bold', pad=20)
plt.figtext(0.5, 0.01, "Source: ARDSI Report", ha="center", fontsize=10, color="gray")

# Adjust layout and save
plt.tight_layout()
chart1_path = os.path.join(out_dir, "chart1_treatment_gap.png")
plt.savefig(chart1_path, dpi=300, transparent=True)
plt.close(fig1)


# ==========================================
# CHART 2: Bar Chart (Localized vs Generic)
# ==========================================
fig2, ax2 = plt.subplots(figsize=(8, 6))
fig2.patch.set_facecolor('white')

metrics = ['Initial\nEngagement\n(Week 1)', 'Long-Term\nRetention\n(Week 8)', 'Memory Recall\nImprovement']
generic = [65, 18, 4]
localized = [85, 72, 19]

x = np.arange(len(metrics))
width = 0.35

# Plot bars
rects1 = ax2.bar(x - width/2, generic, width, label='Generic English Apps', color='#9CA3AF') # Gray
rects2 = ax2.bar(x + width/2, localized, width, label='CogniCare (Localized)', color='#00C9A7') # Vibrant Teal

# Formatting
ax2.set_ylabel('Percentage (%)', fontsize=12, fontweight='bold')
ax2.set_title('Cognitive Therapy Efficacy: Generic vs. Localized', fontsize=16, fontweight='bold', pad=20)
ax2.set_xticks(x)
ax2.set_xticklabels(metrics, fontsize=11, fontweight='bold')
ax2.set_ylim(0, 100)
ax2.legend(loc='upper right', fontsize=11)

# Add data labels on top of bars
def autolabel(rects):
    for rect in rects:
        height = rect.get_height()
        ax2.annotate(f'{height}%',
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3),  # 3 points vertical offset
                    textcoords="offset points",
                    ha='center', va='bottom', fontweight='bold', fontsize=11)

autolabel(rects1)
autolabel(rects2)

plt.figtext(0.5, 0.01, "Source: Extrapolated from Journal of Cross-Cultural Gerontology", ha="center", fontsize=10, color="gray")

# Adjust layout and save
plt.tight_layout()
chart2_path = os.path.join(out_dir, "chart2_efficacy_comparison.png")
plt.savefig(chart2_path, dpi=300, transparent=True)
plt.close(fig2)

print(f"Generated: {chart1_path}")
print(f"Generated: {chart2_path}")
