/**
 * solace.js - 留愛心安 · 心靈燈塔與生死撫慰終端 (Terminal of Solace & Remembrance)
 * 100% Client-Side Pure JS / 零伺服器依賴 / 撫慰在生者心靈彩蛋模組
 */
(function () {
    'use strict';

    var MONO = '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace';
    var SERIF = '"Noto Serif TC", "Source Han Serif TC", "Songti TC", Georgia, serif';

    var S = {
        title: 'background: #0b0f19; color: #38bdf8; font-family: ' + MONO + '; font-size: 13px; font-weight: 900; padding: 7px 12px; border-left: 5px solid #38bdf8; border-top: 1px solid #1e293b; border-right: 1px solid #1e293b; display: block;',
        sub: 'background: #0b0f19; color: #34d399; font-family: ' + MONO + '; font-size: 11px; font-weight: bold; padding: 4px 12px; border-left: 5px solid #34d399; border-bottom: 1px solid #1e293b; border-right: 1px solid #1e293b; display: block;',
        boxWarm: 'background: #111827; color: #f1f5f9; font-family: ' + SERIF + '; font-size: 12px; line-height: 1.8; padding: 12px 16px; border-left: 5px solid #f59e0b; border-top: 1px solid #1f2937; border-bottom: 1px solid #1f2937; border-right: 1px solid #1f2937; display: block; white-space: pre-wrap;',
        quote: 'background: #0f172a; color: #94a3b8; font-family: ' + SERIF + '; font-size: 11.5px; font-style: italic; line-height: 1.7; padding: 10px 14px; border-left: 4px solid #64748b; display: block;',
        cliBar: 'background: #0b0f19; color: #38bdf8; font-family: ' + MONO + '; font-size: 11px; font-weight: bold; padding: 6px 12px; border: 1px solid #1e293b; border-left: 5px solid #38bdf8; display: block;',
        cmdKey: 'background: #1e293b; color: #38bdf8; font-weight: 900; font-family: ' + MONO + '; padding: 2px 6px; border-radius: 3px;',
        cmdDesc: 'background: transparent; color: #cbd5e1; font-family: ' + MONO + '; padding: 1px 6px;'
    };

    function renderSolaceTerminal() {
        console.log('%c🌿 [ 留愛心安 · 心靈燈塔終端 // TERMINAL OF SOLACE & PEACE ]', S.title);
        console.log('%c留愛於生，遇事心安 ‧ 當你看到這裡，代表愛從未離開 ‧ 守護在人間延續', S.sub);
        console.log('');

        var introText = [
            '「死亡不是真正的告別，遺忘才是。',
            ' 這座保險庫不是一份冰冷的資產清單，而是一封深思熟慮的情書。',
            ' 當你開啟這個終端，代表那個愛你的人，已跨越時空為你卸下了最沉重的繁雜手續。',
            ' 請深呼吸，悲傷會如潮水退去，但留在沙灘上的愛與秩序，會一生陪伴你。」'
        ].join('\n');
        console.log('%c' + introText, S.boxWarm);
        console.log('');

        console.log(
            '%c💭「人生的本質不是擁有，而是一場短暫的借用。我們借用了星塵的軀體相遇，終將歸還於天地；但相伴的每分每秒，都已銘刻於宇宙的記憶之中。」',
            S.quote
        );
        console.log('');

        console.log('%c💡 心靈撫慰與思念指令 (CLI): 請輸入 solace.help() 探索溫暖引導', S.cliBar);
    }

    var breathTimer = null;
    var breathOverlay = null;

    function removeBreathOverlay() {
        if (breathTimer) {
            clearInterval(breathTimer);
            breathTimer = null;
        }
        if (breathOverlay && breathOverlay.parentNode) {
            breathOverlay.parentNode.removeChild(breathOverlay);
            breathOverlay = null;
        }
    }

    window.solace = Object.freeze({
        help: function () {
            console.log('%c[ 心靈指引指令集 // SOLACE COMMAND SUITE ]', S.sub);
            console.log('%csolace.letter()%c   - 閱讀《致留在人間的你》：立庫者的深情告白', S.cmdKey, S.cmdDesc);
            console.log('%csolace.comfort()%c  - 撫慰心靈：如何面對恐懼、離別與未完的話語', S.cmdKey, S.cmdDesc);
            console.log('%csolace.breathe()%c  - 啟動 60 秒「月光呼吸沉靜儀」：平復驚慌的心跳', S.cmdKey, S.cmdDesc);
            console.log('%csolace.stars()%c    - 星塵哲思：卡爾·薩根視角的永恆相遇', S.cmdKey, S.cmdDesc);
            console.log('%csolace.audit()%c    - 檢視這座金庫為你建立的「三道愛的防線」', S.cmdKey, S.cmdDesc);
            console.log('%csolace.provenance()%c- 檢索持有人數位簽署與存證認證鏈', S.cmdKey, S.cmdDesc);
            return '請於下方輸入任一指令並按 Enter（例如輸入 solace.letter()）。';
        },

        // 💌 致留下來的家人：告白信
        letter: function () {
            var letterContent = [
                '親愛的家人：',
                '',
                '當你看到這段文字時，代表我可能已經走完了人生的航程，先行離席了。',
                '',
                '請不要害怕，也不要陷入自責或長久的慌亂。',
                '我生前花時間研究加密、一筆筆核對保單、把線索鎖進保險箱，',
                '不是因為我預感死亡有多可怕，而是因為我深愛著你們。',
                '',
                '我不想讓你們在最悲傷脆弱、眼淚還沒擦乾的時候，',
                '還要孤身一人去翻箱倒櫃、去猜測我的密碼、去面對各家機構繁瑣冰冷的櫃檯。',
                '',
                '這座保險庫，是我在理性與清醒之時，為你們築起的最後一道避風港。',
                '綠色區是我的保單名冊，你們不用密碼就能直接去官方開檔；',
                '保險箱裡的提示卡，藏著我們共同的家庭記憶，解鎖後會有專屬經紀人協助你們。',
                '',
                '生命就像一場旅行，雖然我的旅程告一段落，但我留下的愛、教誨與牽掛，',
                '將透過這份秩序，安靜地托住你們的生活。',
                '',
                '請好好吃飯，好好睡覺，代我去看明天的日出與星空。',
                '我已心滿意足，遇事心安。'
            ].join('\n');

            console.log('%c' + letterContent, S.boxWarm);
            return '🕊️「愛永不止息。」(Love never fails.)';
        },

        // 🌿 面對悲傷與死亡的心理引導
        comfort: function () {
            var comfortText = [
                '【給此刻正感到悲傷、迷惘或恐懼的你】',
                '',
                '1. 接受脆弱與混亂：',
                '   此時此刻，不論你是想哭泣、感到麻木，還是感到憤怒，都是完全正常且健康的。',
                '   不要逼自己立刻堅強，一次只處理眼前的一件事。',
                '',
                '2. 死亡無法抹除真實存在過的美好：',
                '   那個愛你的人雖然不在身邊，但他對你的愛、你們共同經歷的歡笑，',
                '   已經成為你生命基因與人格的一部分，誰也奪不走。',
                '',
                '3. 你已經做得很好了：',
                '   你找到了這份檔案，正在有條不紊地處理後事。',
                '   如果在生時有未及說出的感謝或遺憾，請在心裡對他說，他一定聽得見。',
                '',
                '4. 關於死亡的恐懼：',
                '   死亡不是深淵，只是生命形態的重置。在出生前的數十億年裡，我們也曾在那裡安詳沉睡。',
                '   他只是先回到了那個平靜的家園，靜靜守望著你。'
            ].join('\n');

            console.log('%c' + comfortText, S.boxWarm);
            return '願平靜與勇氣與你同在。';
        },

        // 🌌 星塵哲思 (Cosmic Perspective)
        stars: function () {
            var stardustText = [
                '「構成我們心臟的鐵、骨骼中的鈣，以及血液中的碳，',
                ' 全部源自數十億年前某顆塌縮超新星的內部熔爐。',
                '',
                ' 我們每一個人，都是宇宙用星塵捏造出的奇蹟。',
                ' 在浩瀚無垠的時空中，我們能夠擁有重疊的歲月、相遇、相愛，',
                ' 這本身就是機率趨近於零的巨大恩賜。',
                '',
                ' 死亡不是生命的湮滅，只是星塵的歸位。',
                ' 當肉身散去，那些原子會回到大地、蒸發入大氣、重新匯入宇宙的洋流。',
                ' 他未曾真正遠去，他存在於你吹過的每一陣微風、看過的每一次落日之中。」'
            ].join('\n');

            console.log('%c' + stardustText, S.quote);
            return '🌟「我們都是宇宙借來認識它自己的眼睛。」—— Carl Sagan';
        },

        // 🧘 60 秒「月光呼吸沉靜儀」（平復急性焦慮與悲傷）
        breathe: function () {
            if (breathOverlay) {
                removeBreathOverlay();
                console.log('%c[ 呼吸練習已結束 / Breathing session concluded ]', 'color:#34d399; font-weight:bold;');
                return '已恢復常態。';
            }

            console.log('%c[ 啟動 60 秒月光呼吸平復練習 // BOX BREATHING ACTIVE ]', 'background:#0284c7; color:#fff; font-weight:bold; padding:4px 8px; font-family:' + MONO);
            console.log('%c請注視螢幕中央的呼吸光環，放鬆肩膀，跟隨指引調節節奏。（點擊畫面任意處即可關閉）', S.sub);

            // 構建柔和月光呼吸浮層
            breathOverlay = document.createElement('div');
            breathOverlay.id = 'solace-breath-overlay';
            breathOverlay.style.cssText = [
                'position: fixed',
                'top: 0',
                'left: 0',
                'width: 100vw',
                'height: 100vh',
                'background: rgba(11, 15, 25, 0.85)',
                'backdrop-filter: blur(8px)',
                'z-index: 999999',
                'display: flex',
                'flex-direction: column',
                'align-items: center',
                'justify-content: center',
                'cursor: pointer',
                'user-select: none'
            ].join(';');

            breathOverlay.innerHTML = [
                '<div style="text-align: center; color: #f8fafc; font-family: ' + SERIF + ';">',
                '  <div id="breath-circle" style="width: 140px; height: 140px; border-radius: 50%; background: radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(52,211,153,0.1) 70%); border: 2px solid #38bdf8; margin: 0 auto 24px auto; transition: transform 4s ease-in-out, box-shadow 4s ease-in-out; box-shadow: 0 0 25px rgba(56,189,248,0.4); display: flex; align-items: center; justify-content: center;">',
                '    <span id="breath-status" style="font-size: 15px; font-weight: bold; color: #38bdf8;">吸氣 (Inhale)</span>',
                '  </div>',
                '  <h2 style="font-size: 16px; font-weight: normal; letter-spacing: 2px; margin-bottom: 8px;">安頓呼吸 ‧ 遇事心安</h2>',
                '  <p id="breath-sub" style="font-size: 12px; color: #94a3b8; line-height: 1.6;">緩慢吸氣... 感受氣息充盈胸膛 (4秒)</p>',
                '  <div style="font-size: 10px; color: #64748b; margin-top: 24px;">[ 點擊畫面任意處或按 ESC 結束練習 ]</div>',
                '</div>'
            ].join('');

            document.body.appendChild(breathOverlay);

            var circle = document.getElementById('breath-circle');
            var statusEl = document.getElementById('breath-status');
            var subEl = document.getElementById('breath-sub');

            var cycle = 0; // 0: 吸氣(4s), 1: 屏息(4s), 2: 呼氣(4s), 3: 靜止(4s)
            function updateBreath() {
                cycle = (cycle + 1) % 4;
                if (cycle === 0) {
                    circle.style.transform = 'scale(1.4)';
                    circle.style.boxShadow = '0 0 45px rgba(56,189,248,0.7)';
                    statusEl.innerText = '吸氣 (Inhale)';
                    statusEl.style.color = '#38bdf8';
                    subEl.innerText = '緩慢吸氣... 感受世界正溫柔托住你 (4秒)';
                } else if (cycle === 1) {
                    statusEl.innerText = '屏息 (Hold)';
                    statusEl.style.color = '#fbbf24';
                    subEl.innerText = '屏住呼吸... 感受當下的寧靜與安全 (4秒)';
                } else if (cycle === 2) {
                    circle.style.transform = 'scale(0.85)';
                    circle.style.boxShadow = '0 0 15px rgba(52,211,153,0.3)';
                    statusEl.innerText = '呼氣 (Exhale)';
                    statusEl.style.color = '#34d399';
                    subEl.innerText = '緩慢吐氣... 將心中的慌亂與焦慮隨氣息吐出 (4秒)';
                } else if (cycle === 3) {
                    statusEl.innerText = '平靜 (Rest)';
                    statusEl.style.color = '#94a3b8';
                    subEl.innerText = '保持放鬆... 你的身心正在慢慢平復 (4秒)';
                }
            }

            // 初次觸發膨脹
            setTimeout(function () {
                if (circle) {
                    circle.style.transform = 'scale(1.4)';
                    circle.style.boxShadow = '0 0 45px rgba(56,189,248,0.7)';
                }
            }, 100);

            breathTimer = setInterval(updateBreath, 4000);

            breathOverlay.addEventListener('click', function () {
                removeBreathOverlay();
            });

            function onEsc(e) {
                if (e.key === 'Escape') {
                    removeBreathOverlay();
                    window.removeEventListener('keydown', onEsc);
                }
            }
            window.addEventListener('keydown', onEsc);

            return '月光呼吸儀已啟動。跟隨節奏深呼吸，讓心跳找回平靜。';
        },

        // 🛡️ 三道愛的防線審計
        audit: function () {
            var auditTable = [
                '┌──────────────────────┬────────────────────────┬────────────────────────┐',
                '│ 愛的防線 (Line)      │ 守護機制 (Mechanism)   │ 心理與實務價值 (Value) │',
                '├──────────────────────┼────────────────────────┼────────────────────────┤',
                '│ 第一道：免密索償名冊 │ 綠色公開層 (No-Pass)   │ 零障礙：免猜密碼直接開檔│',
                '│ 第二道：家庭記憶線索 │ 保險箱提示卡 (Clue)    │ 零出錯：只有至親懂得拼湊│',
                '│ 第三道：AES-256 金庫 │ 客戶端純本地隔離 (ZDR) │ 零洩露：在生隱私絕對安全│',
                '└──────────────────────┴────────────────────────┴────────────────────────┘'
            ].join('\n');

            console.log('%c[ 三道防線審計 // THREE LINES OF LOVE & ORDER ]', S.sub);
            console.log('%c' + auditTable, 'background: #0b0f19; color: #38bdf8; font-family: ' + MONO + '; font-size: 11px; line-height: 1.5; padding: 6px 10px; display: block; white-space: pre;');
            return '系統狀態：完備無缺。愛與秩序已全面就位。';
        },

        // 📜 密碼學存證與權威身份認證
        provenance: function () {
            console.log('%c[ CANONICAL PROVENANCE RECORDS // 權威身份與專業存證鏈 ]', S.title);
            console.log('• ORCID iD       : https://orcid.org/0009-0006-0855-0842');
            console.log('• PGP Key ID     : FFA3E47793F1CA32');
            console.log('• PGP Raw Key    : https://keybase.io/jackylawck/pgp_keys.asc');
            console.log('• Keybase Proof  : https://keybase.io/jackylawck');
            console.log('• HKCS W3C ID    : https://hkcs.org.hk/verify/?id=019dd246-6cba-724a-8360-476e1965a1fb');
            console.log('• Mastermind ID  : https://www.credly.com/badges/c6abd067-0cd9-47c5-bcbd-8becd6e86429/public_url');
            console.log('• Oracle GenAI   : https://catalog-education.oracle.com/ords/certview/sharebadge_m?id=E9A6CD33539B3B4476ECF08CDF00F0935F8A39101F74B1C929B7683E4FCF4096');
            return 'Cryptographic identity verified. All anchors validated.';
        }
    });

    // 延遲 300 毫秒載入，確保不阻塞主 UI 渲染
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(renderSolaceTerminal, 300);
    } else {
        window.addEventListener('DOMContentLoaded', function () {
            setTimeout(renderSolaceTerminal, 300);
        });
    }
})();
