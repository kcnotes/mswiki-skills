<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:variable name="strings" select="document('../Skill.img.xml')"/>
    <xsl:output method="xml" indent="yes"/>

    <xsl:template match="/">
        <xsl:apply-templates select="@*|node()"/>
    </xsl:template>

    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="/skills/skill">
        <xsl:variable name="skillId" select="id" />
        <xsl:copy>
            <xsl:apply-templates select="@*|node()" />
            <strings>
                <xsl:copy-of select="$strings/imgdir[@name='Skill.img']/imgdir[@name=$skillId]/*" />
                <xsl:copy-of select="$strings/dir[@name='Skill.img']/dir[@name=$skillId]/*" />
            </strings>
        </xsl:copy>
    </xsl:template>
    
</xsl:stylesheet>