<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" indent="yes"/>
    <xsl:template match="/">
        <skills>
            <xsl:apply-templates select="/imgdir/imgdir[@name='skill']/imgdir"/>
        </skills>
    </xsl:template>
    <xsl:template match="/imgdir/imgdir[@name='skill']/imgdir">
        <skill>
            <id><xsl:value-of select="@name"/></id>
            <attr>
                <xsl:copy-of select="./imgdir[@name='common']/*"/>
            </attr>
            <info>
                <xsl:copy-of select="./imgdir[@name='info']/*"/>
            </info>
            <xsl:copy-of select="./int" />
            <xsl:copy-of select="./string[@name='elemAttr']"/>
        </skill>
    </xsl:template>
</xsl:stylesheet>