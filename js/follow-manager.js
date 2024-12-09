import { database, auth } from '../firebase-config.js';
import { ref, onValue, set, remove, runTransaction } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

class FollowManager {
    constructor() {
        this.followCounts = {};
        this.userFollowing = {};
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;
        
        // Load initial follow counts
        const followCountsRef = ref(database, 'categories');
        onValue(followCountsRef, (snapshot) => {
            this.followCounts = snapshot.val() || {};
            this.updateAllFollowCounts();
        });

        // Load user's following status when authenticated
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = ref(database, `users/${user.uid}/following`);
                onValue(userRef, (snapshot) => {
                    this.userFollowing = snapshot.val() || {};
                    this.updateAllFollowButtons();
                });
            }
        });

        this.initialized = true;
    }

    async toggleFollow(categoryName) {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = ref(database, `users/${user.uid}/following/${categoryName}`);
        const categoryRef = ref(database, `categories/${categoryName}/followCount`);

        const isFollowing = this.userFollowing[categoryName];
        
        if (isFollowing) {
            await remove(userRef);
            await runTransaction(categoryRef, (count) => (count || 1) - 1);
        } else {
            await set(userRef, true);
            await runTransaction(categoryRef, (count) => (count || 0) + 1);
        }
    }

    updateFollowButton(element, categoryName) {
        const followButton = element.querySelector('.follow-button');
        if (!followButton) return;

        const isFollowing = this.userFollowing[categoryName];
        followButton.classList.toggle('following', isFollowing);
        const tooltip = followButton.querySelector('.follow-tooltip');
        if (tooltip) {
            tooltip.textContent = isFollowing ? 'Unfollow' : 'Follow';
        }
    }

    updateFollowCount(element, categoryName) {
        const countElement = element.querySelector('.follow-count');
        if (!countElement) return;

        const count = (this.followCounts[categoryName]?.followCount || 0);
        countElement.textContent = count.toLocaleString();
    }

    updateAllFollowButtons() {
        document.querySelectorAll('.category-card').forEach(card => {
            const categoryName = card.getAttribute('data-category');
            this.updateFollowButton(card, categoryName);
        });
    }

    updateAllFollowCounts() {
        document.querySelectorAll('.category-card').forEach(card => {
            const categoryName = card.getAttribute('data-category');
            this.updateFollowCount(card, categoryName);
        });
    }
}

export const followManager = new FollowManager();
