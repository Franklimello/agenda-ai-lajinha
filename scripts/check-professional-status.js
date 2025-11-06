// Script para verificar status de um profissional
const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'agendaailajinha',
  });
}

const db = admin.firestore();

async function checkProfessional(userId) {
  try {
    console.log('🔍 Verificando profissional:', userId);
    
    // Buscar usuário
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.log('❌ Usuário não encontrado');
      return;
    }
    
    const userData = userDoc.data();
    console.log('\n📋 Dados do usuário:');
    console.log('- Nome:', userData.name || 'NÃO DEFINIDO');
    console.log('- Telefone:', userData.phone || 'NÃO DEFINIDO');
    console.log('- Status:', userData.status !== false ? 'ATIVO' : 'INATIVO');
    console.log('- Horários:', userData.times ? `${userData.times.length} horários` : 'NENHUM');
    console.log('- Email:', userData.email || 'NÃO DEFINIDO');
    
    // Verificar perfil completo
    const hasCompleteProfile = !!(
      userData.name &&
      userData.phone &&
      userData.times &&
      Array.isArray(userData.times) &&
      userData.times.length > 0
    );
    console.log('\n✅ Perfil completo:', hasCompleteProfile ? 'SIM' : 'NÃO');
    
    // Verificar plano
    const subscriptionDoc = await db.collection('subscriptions')
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .limit(1)
      .get();
    
    const hasActivePlan = !subscriptionDoc.empty;
    console.log('✅ Plano ativo:', hasActivePlan ? 'SIM' : 'NÃO');
    if (hasActivePlan) {
      const subData = subscriptionDoc.docs[0].data();
      console.log('   - Plano:', subData.plan);
      console.log('   - Status:', subData.status);
    }
    
    // Verificar serviços
    const servicesSnapshot = await db.collection('services')
      .where('userId', '==', userId)
      .where('status', '==', true)
      .get();
    
    console.log('✅ Serviços ativos:', servicesSnapshot.empty ? 'NENHUM' : `${servicesSnapshot.docs.length} serviço(s)`);
    if (!servicesSnapshot.empty) {
      servicesSnapshot.docs.forEach(doc => {
        const serviceData = doc.data();
        console.log(`   - ${serviceData.name} (R$ ${serviceData.price})`);
      });
    }
    
    // Resultado final
    const shouldAppear = userData.status !== false && 
                        hasCompleteProfile && 
                        hasActivePlan && 
                        !servicesSnapshot.empty;
    
    console.log('\n🎯 Deve aparecer na home:', shouldAppear ? 'SIM ✅' : 'NÃO ❌');
    
    if (!shouldAppear) {
      console.log('\n⚠️  Motivos para não aparecer:');
      if (userData.status === false) {
        console.log('   - Status está INATIVO');
      }
      if (!hasCompleteProfile) {
        console.log('   - Perfil incompleto (falta nome, telefone ou horários)');
      }
      if (!hasActivePlan) {
        console.log('   - Não tem plano ativo');
      }
      if (servicesSnapshot.empty) {
        console.log('   - Não tem serviços ativos');
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    process.exit(0);
  }
}

// Pegar userId dos argumentos
const userId = process.argv[2];
if (!userId) {
  console.log('❌ Por favor, forneça o userId como argumento');
  console.log('Uso: node scripts/check-professional-status.js <userId>');
  process.exit(1);
}

checkProfessional(userId);

